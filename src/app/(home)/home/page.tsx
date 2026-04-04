import type { Metadata } from "next";
import dynamic from "next/dynamic";

import HeroBlock from "@/features/home/landingPage/home-hero";
import RoomsBlock from "@/features/home/landingPage/rooms-block";

const InstructionsBlock = dynamic(() => import("@/features/home/landingPage/instructions-block"));
const PricingBlock = dynamic(() => import("@/features/home/landingPage/pricing-block"));
const ReviewsBlock = dynamic(() => import("@/features/home/landingPage/reviews-block"));
const ContactBlock = dynamic(() => import("@/features/home/landingPage/contact-block"));

export const metadata: Metadata = {
  title: "Trang chủ | Monopoly Experience Hub",
  description: "Khám phá văn hoá Việt trong từng bước đi...",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroBlock />
      <RoomsBlock />
      <InstructionsBlock />
      <PricingBlock />
      <ReviewsBlock />
      <ContactBlock />
    </main>
  );
}
