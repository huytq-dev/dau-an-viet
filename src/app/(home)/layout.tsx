import React from "react"
import HomeHeader from "@/features/home/layout/home-header"
import ConditionalFooter from "@/features/home/layout/conditional-footer"
import { BookingProvider } from "@/providers/booking-context"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col">
        <HomeHeader />
        <main className="flex-1">
          {children}
        </main>
        <ConditionalFooter />
      </div>
    </BookingProvider>
  )
}
