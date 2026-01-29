"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import BookingModal from "./modal/booking-modal";
import { AnimatedText } from "@/components/ui/animated-text";
import { ArrowRight } from "lucide-react";

export default function HeroBlock() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
            style={{ translateY: offset * 0.5 }}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop')",
              }}
            />
          </motion.div>
        </div>

        {/* --- CẢI THIỆN 1: Overlay tối hơn và rõ ràng hơn --- */}
        {/* Lớp 1: Làm tối tổng thể 40% để giảm độ chói của ảnh gốc */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Lớp 2: Gradient nhấn mạnh phần dưới và trên cùng để làm nền cho text header/footer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/90 z-10" />
        
        {/* Grain effect */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] z-10 pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-6 relative z-20 text-center max-w-5xl">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {/* Tagline */}
            <motion.span 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               // Thêm drop-shadow để tagline rõ hơn
               className="uppercase tracking-[0.3em] text-xs md:text-sm text-yellow-400 font-bold drop-shadow-md"
            >
              Không gian trải nghiệm Cờ Tỷ Phú thực
            </motion.span>

            {/* --- CẢI THIỆN 2 & 3: Font dày hơn và Drop Shadow mạnh --- */}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBookingOpen(true)}
              // Tăng độ đục của nền nút (bg-white/20) để nút nổi hơn
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
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        </motion.div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
