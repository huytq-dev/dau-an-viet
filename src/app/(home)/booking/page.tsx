import type { Metadata } from "next"
import BookingPage from "@/features/booking/booking-page"

export const metadata: Metadata = {
  title: "Đặt Vé | Đầu Chân Việt",
  description: "Đặt vé tham quan và trải nghiệm các phòng chơi tại Đầu Chân Việt.",
}

export default function Page() {
  return <BookingPage />
}
