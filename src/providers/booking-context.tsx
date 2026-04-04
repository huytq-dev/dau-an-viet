'use client'

import { createContext, useContext, useState } from 'react'
import BookingModal from '@/features/home/modal/booking-modal'

interface BookingContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const BookingContext = createContext<BookingContextType | null>(null)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BookingContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
