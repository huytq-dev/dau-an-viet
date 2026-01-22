"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import BookingModal from "./modal/booking-modal";
import { AnimatedText } from "@/components/ui/animated-text";

export default function HeroBlock() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="container mx-auto px-4 relative z-20 text-center max-w-5xl">
          <div className="flex flex-col items-center gap-8 animate-fade-in-up">

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              <AnimatedText 
                animationType="slideUp" 
                dependencyKey={`${currentLanguage}-hero-title`}
              >
                {t("hero.title") || "Discover Vietnamese culture in every step"}
              </AnimatedText>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md">
              <AnimatedText 
                animationType="fade" 
                dependencyKey={`${currentLanguage}-hero-subtitle`}
              >
                Monopoly Experience Hub - Trải nghiệm văn hóa theo cách riêng của bạn.
              </AnimatedText>
            </p>

            {/* Nút bấm */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="mt-4 px-12 py-5 bg-yellow-400 text-red-900 rounded-full hover:bg-yellow-300 hover:scale-105 hover:shadow-xl transition-all duration-300 font-extrabold text-xl uppercase tracking-wide"
            >
              <AnimatedText 
                animationType="fade" 
                dependencyKey={`${currentLanguage}-hero-button`}
              >
                {t("hero.button") || "BOOK NOW"}
              </AnimatedText>
            </button>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}