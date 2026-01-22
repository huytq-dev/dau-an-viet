import HeroBlock from "@/features/home/components/home-hero"
import RoomsBlock from "@/features/home/components/rooms-block"
import InstructionsBlock from "@/features/home/components/instructions-block"
import PricingBlock from "@/features/home/components/pricing-block"
import ReviewsBlock from "@/features/home/components/reviews-block"
import ContactBlock from "@/features/home/components/contact-block"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section id="hero">
        <HeroBlock />
      </section>
      <section id="rooms">
        <RoomsBlock />
      </section>
      <section id="instructions">
        <InstructionsBlock />
      </section>
      <section id="pricing">
        <PricingBlock />
      </section>
      <section id="reviews">
        <ReviewsBlock />
      </section>
      <section id="contact">
        <ContactBlock />
      </section>
    </main>
  )
}
