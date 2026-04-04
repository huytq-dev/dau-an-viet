"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import BookingCalendar from "./components/booking-calendar"
import TimeSlotPanel from "./components/time-slot-panel"

const TICKET_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

const TIME_FILTERS = [
  { value: 'all', label: 'Tất cả khung giờ' },
  { value: 'morning', label: 'Buổi sáng (9:00 – 12:00)' },
  { value: 'afternoon', label: 'Buổi chiều (12:00 – 17:00)' },
  { value: 'evening', label: 'Buổi tối (17:00+)' },
]

// Min/max months with data
const MIN_MONTH = new Date(2026, 3, 1) // April 2026
const MAX_MONTH = new Date(2026, 4, 1) // May 2026

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function BookingPage() {
  const today = useMemo(() => toDateStr(new Date()), [])

  const [ticketCount, setTicketCount] = useState(2)
  const [timeFilter, setTimeFilter] = useState('all')
  const [currentMonth, setCurrentMonth] = useState(MIN_MONTH)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setIsPanelOpen(true)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const canGoPrev = currentMonth.getTime() > MIN_MONTH.getTime()
  const canGoNext = currentMonth.getTime() < MAX_MONTH.getTime()

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Notice */}
        <div className="text-center mb-8 space-y-1">
          <p className="text-[#fef3c7]/80 text-sm">
            Tất cả vé đã bao gồm phí đặt chỗ.
          </p>
          <p className="text-[#fef3c7]/50 text-sm italic">
            Giá niêm yết là theo mỗi người.
          </p>
        </div>

        {/* Selector row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Ticket count */}
          <div className="relative">
            <select
              value={ticketCount}
              onChange={e => setTicketCount(Number(e.target.value))}
              className="appearance-none bg-white text-gray-900 font-semibold px-5 py-3.5 pr-10 rounded-xl border border-gray-200 shadow-sm cursor-pointer w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#fcd34d]"
            >
              {TICKET_OPTIONS.map(n => (
                <option key={n} value={n}>
                  {n} Vé
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Time filter */}
          <div className="relative flex-1">
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className="appearance-none bg-white text-gray-900 font-semibold px-5 py-3.5 pr-10 rounded-xl border border-gray-200 shadow-sm cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-[#fcd34d]"
            >
              {TIME_FILTERS.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Calendar */}
        <BookingCalendar
          month={currentMonth}
          today={today}
          onDateSelect={handleDateSelect}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />

        {/* Time slot dialog */}
        {selectedDate && (
          <TimeSlotPanel
            open={isPanelOpen}
            selectedDate={selectedDate}
            ticketCount={ticketCount}
            timeFilter={timeFilter}
            onClose={() => setIsPanelOpen(false)}
            onDateChange={setSelectedDate}
          />
        )}
      </div>
    </div>
  )
}
