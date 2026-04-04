"use client"

import { usePathname } from "next/navigation"
import HomeFooter from "./home-footer"

export default function ConditionalFooter() {
  const pathname = usePathname()
  const isBookingPage = pathname.startsWith("/booking")

  if (isBookingPage) return null

  return <HomeFooter />
}
