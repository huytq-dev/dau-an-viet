import type { Metadata } from "next"
import CheckoutPage from "@/features/checkout/checkout-page"

export const metadata: Metadata = {
  title: "Thanh Toán | Dấu Chân Việt",
  description: "Hoàn tất đặt vé tại Dấu Chân Việt.",
}

export default function Page() {
  return <CheckoutPage />
}
