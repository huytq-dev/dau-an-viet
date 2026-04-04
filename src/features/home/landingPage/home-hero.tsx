"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/animated-text";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useBooking } from "@/providers/booking-context";

export default function HeroBlock() {
  const { open } = useBooking();
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
  const [offset, setOffset] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);

  return (
    <>
      <section
        id="hero"
        className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 10, ease: "easeOut" }}
            className="w-full h-full"
            style={{ translateY: prefersReducedMotion ? 0 : offset * 0.5 }}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/home_hero_bg_img.png')",
              }}
            />
          </motion.div>
        </div>

        {/* Lớp 1: Làm tối tổng thể */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Lớp 2: Gradient nhấn mạnh phần dưới và trên */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/90 z-10" />

        {/* Grain effect */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] z-10 pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-6 relative z-20 text-center max-w-5xl">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {/* Tagline */}
            <motion.span
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
               className="uppercase tracking-[0.3em] text-xs md:text-sm text-yellow-400 font-bold drop-shadow-md"
            >
              {t("hero.tagline")}
            </motion.span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.1] tracking-tight drop-shadow-2xl">
              <AnimatedText
                animationType="slideUp"
                dependencyKey={`${currentLanguage}-hero-title`}
              >
                {t("hero.heading")}
              </AnimatedText>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-gray-100 max-w-2xl leading-relaxed font-normal drop-shadow-md">
              <AnimatedText
                animationType="fade"
                dependencyKey={`${currentLanguage}-hero-subtitle`}
              >
                {t("hero.title")}
              </AnimatedText>
            </p>

            {/* Button */}
            <motion.button
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              onClick={open}
              className="group relative mt-6 px-8 py-4 bg-white/20 backdrop-blur-lg border border-white/30 text-white rounded-full overflow-hidden transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-3 font-bold tracking-wider text-sm md:text-base uppercase drop-shadow-sm">
                <AnimatedText
                  animationType="fade"
                  dependencyKey={`${currentLanguage}-hero-button`}
                >
                  {t("hero.button") || "Book Now"}
                </AnimatedText>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/80 drop-shadow-md"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent mx-auto mb-2"></div>
          <span className="text-[10px] uppercase tracking-widest font-semibold">{t("hero.scroll")}</span>
        </motion.div>
      </section>
    </>
  );
}
