import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Import trực tiếp các component quan trọng đầu trang để SEO tốt và hiển thị nhanh (LCP)
import HeroBlock from "@/features/home/components/home-hero";
import RoomsBlock from "@/features/home/components/rooms-block";

// Lazy load các component ở dưới để trang load nhanh hơn
const InstructionsBlock = dynamic(() => import("@/features/home/components/instructions-block"));
const PricingBlock = dynamic(() => import("@/features/home/components/pricing-block"));
const ReviewsBlock = dynamic(() => import("@/features/home/components/reviews-block"));
const ContactBlock = dynamic(() => import("@/features/home/components/contact-block"));

export const metadata: Metadata = {
  title: "Trang chủ | Monopoly Experience Hub",
  description: "Khám phá văn hoá Việt trong từng bước đi...",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Block */}
      <section id="hero">
        <HeroBlock />
      </section>

      {/* Rooms Block - scroll-mt để tránh bị header che khi cuộn */}
      <section id="rooms" className="scroll-mt-24">
        <RoomsBlock />
      </section>

      {/* Instructions Block - Có thể thêm bg khác màu để tách biệt */}
      <section id="instructions" className="scroll-mt-24 bg-secondary/10">
        <InstructionsBlock />
      </section>

      <section id="pricing" className="scroll-mt-24">
        <PricingBlock />
      </section>

      <section id="reviews" className="scroll-mt-24 bg-secondary/10">
        <ReviewsBlock />
      </section>

      <section id="contact" className="scroll-mt-24">
        <ContactBlock />
      </section>
    </main>
  );
}