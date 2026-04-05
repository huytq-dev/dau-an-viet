"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CALENDAR_MAP,
  STATUS_BADGE_COLORS,
  STATUS_LABELS,
  STATUS_TEXT_COLORS,
  formatPrice,
} from "../data/booking-data"

interface BookingCalendarProps {
  month: Date
  today: string
  onDateSelect: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

const DAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildCalendarGrid(month: Date): Date[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const dayOfWeek = firstDay.getDay() // 0=Sun
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startDate = new Date(firstDay)
  startDate.setDate(1 - daysToSubtract)

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    return d
  })
}

function isClosingTime(): boolean {
  const now = new Date()
  return now.getHours() > 21 || (now.getHours() === 21 && now.getMinutes() >= 15)
}

export default function BookingCalendar({
  month,
  today,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  canGoPrev,
  canGoNext,
}: BookingCalendarProps) {
  const closed = isClosingTime()
  const cells = useMemo(() => buildCalendarGrid(month), [month])
  const monthLabel = `${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`

  return (
    <div className="rounded-2xl overflow-hidden border border-[#991b1b]/60 shadow-2xl shadow-black/40">
      {/* Month header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#5a0f0f]">
        <h2 className="text-lg sm:text-xl font-bold text-[#fef3c7]">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            disabled={!canGoPrev}
            aria-label="Tháng trước"
            className="p-2 rounded-lg border border-[#fcd34d]/30 text-[#fcd34d] hover:bg-[#fcd34d]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#fef3c7]/50 px-2 hidden sm:block">Hôm nay</span>
          <button
            onClick={onNextMonth}
            disabled={!canGoNext}
            aria-label="Tháng sau"
            className="p-2 rounded-lg border border-[#fcd34d]/30 text-[#fcd34d] hover:bg-[#fcd34d]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 bg-[#6b1414] border-b border-[#991b1b]/40">
        {DAY_HEADERS.map(day => (
          <div key={day} className="py-2 text-center text-xs sm:text-sm font-semibold text-[#fef3c7]/50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 bg-[#6b1414]">
        {cells.map((date, idx) => {
          const dateStr = toDateStr(date)
          const isCurrentMonth = date.getMonth() === month.getMonth()
          const dayData = CALENDAR_MAP.get(dateStr)
          const isToday = dateStr === today
          const isPastDate = dateStr < today
          const isTodayClosed = isToday && closed
          const isClickable =
            isCurrentMonth &&
            !!dayData &&
            dayData.status !== 'sold-out' &&
            dayData.status !== 'off-sale' &&
            !isPastDate &&
            !isTodayClosed

          return (
            <div
              key={idx}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={() => isClickable && onDateSelect(dateStr)}
              onKeyDown={(e) => e.key === 'Enter' && isClickable && onDateSelect(dateStr)}
              className={cn(
                'relative border-b border-r border-[#991b1b]/20 min-h-[80px] sm:min-h-[105px] p-1.5 sm:p-2 flex flex-col gap-1 select-none bg-white transition-all duration-150',
                isClickable && 'cursor-pointer hover:bg-[#fff8e7] hover:border-[#fcd34d]/60 hover:shadow-[inset_0_0_0_2px_#fcd34d]',
                !isCurrentMonth && 'opacity-30',
                (isPastDate || isTodayClosed) && isCurrentMonth && 'opacity-40 bg-gray-50',
              )}
            >
              {/* T7/CN badge — đánh dấu cuối tuần giá cao hơn */}
              {isCurrentMonth && dayData && (new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6) && (
                <div className="absolute top-0 left-0 overflow-hidden w-10 h-10 pointer-events-none">
                  <div className="absolute bg-[var(--tone-purple-mid)] text-[var(--tone-purple-fg)] text-[6px] sm:text-[7px] font-black w-[72px] text-center py-[3px] -left-[18px] top-[12px] -rotate-45 leading-tight">
                    CUỐI<br />TUẦN
                  </div>
                </div>
              )}

              {/* Date number */}
              <div className="flex justify-end">
                {isToday ? (
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#fcd34d] flex items-center justify-center text-[#7f1d1d] font-bold text-xs sm:text-sm shrink-0">
                    {date.getDate()}
                  </span>
                ) : (
                  <span className={cn(
                    'text-xs sm:text-sm font-semibold',
                    isCurrentMonth ? 'text-[#7f1d1d]' : 'text-[#7f1d1d]/40'
                  )}>
                    {date.getDate()}
                  </span>
                )}
              </div>

              {/* Price + status */}
              {dayData && isCurrentMonth && (
                <>
                  <p className="text-[9px] sm:text-[10px] text-center leading-tight font-semibold text-[#991b1b]">
                    TỪ {formatPrice(dayData.basePrice)}
                  </p>
                  <div className={cn(
                    'text-[9px] sm:text-[10px] text-center py-0.5 rounded font-semibold mt-auto',
                    STATUS_BADGE_COLORS[dayData.status],
                    STATUS_TEXT_COLORS[dayData.status]
                  )}>
                    {STATUS_LABELS[dayData.status]}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-[#5a0f0f] py-2 text-center text-[10px] text-[#fef3c7]/40">
        Powered by Đầu Chân Việt
      </div>
    </div>
  )
}
