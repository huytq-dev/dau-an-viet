'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BookingModal from './modal/booking-modal'
import Image from 'next/image'
import { AnimatedText } from "@/components/ui/animated-text"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'

export default function RoomsBlock() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const roomsData = [
    {
      id: 1,
      titleKey: 'rooms.room1.title',
      titleEnKey: 'rooms.room1.titleEn',
      image: '/images/room1-mienn-dat-viet.png',
      // Thêm key cho phần players
      playersKey: '3 - 4 đội/ 2 - 3 người',
      playersEnKey: '3 - 4 teams / 2 - 3 players',
      time: '90m',
      fullContentKey: 'rooms.room1.fullContent',
      fullContentEnKey: 'rooms.room1.fullContentEn',
    },
    {
      id: 2,
      titleKey: 'rooms.room2.title',
      titleEnKey: 'rooms.room2.titleEn',
      image: '/images/room2-lang-viet-song.png',
      playersKey: '3 - 4 đội/ 2 - 3 người',
      playersEnKey: '3 - 4 teams / 2 - 3 players',
      time: '90m',
      fullContentKey: 'rooms.room2.fullContent',
      fullContentEnKey: 'rooms.room2.fullContentEn',
    },
    {
      id: 3,
      titleKey: 'rooms.room3.title',
      titleEnKey: 'rooms.room3.titleEn',
      image: '/images/room3-lang-nghe.png',
      playersKey: '3 - 4 đội/ 2 - 3 người',
      playersEnKey: '3 - 4 teams / 2 - 3 players',
      time: '90m',
      fullContentKey: 'rooms.room3.fullContent',
      fullContentEnKey: 'rooms.room3.fullContentEn',
    },
  ]

  const current = roomsData[currentIndex]

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => (prev + newDirection + roomsData.length) % roomsData.length)
  }, [roomsData.length])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  // Hàm helper để lấy nội dung theo ngôn ngữ
  const getTitle = () => (currentLanguage === 'vi' ? t(current.titleKey) : t(current.titleEnKey))
  const getFullContent = () => (currentLanguage === 'vi' ? t(current.fullContentKey) : t(current.fullContentEnKey))
  const getPlayers = () => (currentLanguage === 'vi' ? current.playersKey : current.playersEnKey)

  return (
    <>
      <section 
        id="rooms" 
        className="relative min-h-screen flex items-center py-12 lg:py-24 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#360808] via-[#1a0505] to-black"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* COLUMN IMAGE */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center">
              <div className="relative w-full max-w-[85%] sm:max-w-sm lg:max-w-md aspect-[3/4] lg:aspect-[2/3] group">
                <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-full" />

                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset }) => {
                        const swipe = Math.abs(offset.x) > 50
                        if (swipe) paginate(offset.x > 0 ? -1 : 1)
                      }}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                      <Image
                        src={current.image || "/placeholder.svg"}
                        alt={getTitle()}
                        fill
                        className="object-cover pointer-events-none"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Desktop Arrows */}
                <button onClick={() => paginate(-1)} className="hidden lg:flex absolute -left-20 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-yellow-500 hover:text-black transition-all z-30">
                  <ChevronLeft />
                </button>
                <button onClick={() => paginate(1)} className="hidden lg:flex absolute -right-20 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-yellow-500 hover:text-black transition-all z-30">
                  <ChevronRight />
                </button>
              </div>

              {/* Mobile Dots */}
              <div className="flex gap-2 mt-8 lg:hidden">
                {roomsData.map((_, idx) => (
                  <div key={idx} className={cn("h-1 rounded-full transition-all duration-300", idx === currentIndex ? "w-8 bg-yellow-500" : "w-2 bg-white/20")} />
                ))}
              </div>
            </div>

            {/* COLUMN CONTENT */}
            <div className="lg:col-span-5 order-2 lg:order-1 mt-4 lg:mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-yellow-500" />
                    <span className="text-xs font-bold tracking-[0.3em] text-yellow-500 uppercase">
                      <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-rooms-title`}>
                        {t('rooms.title') || "CÁC PHÒNG CHƠI"}
                      </AnimatedText>
                    </span>
                  </div>

                  <h2 className="text-4xl lg:text-6xl font-black text-white uppercase leading-none tracking-tighter">
                    <AnimatedText animationType="slideUp" dependencyKey={`${currentLanguage}-room-name-${current.id}`}>
                      {getTitle()}
                    </AnimatedText>
                  </h2>

                  {/* INFO BAR - Cập nhật nội dung players song ngữ */}
                  <div className="flex items-center gap-8 py-4 border-y border-white/10 text-xs font-bold tracking-widest text-white/60">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-yellow-500" /> 
                      <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-players-${current.id}`}>
                        {getPlayers()}
                      </AnimatedText>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" /> 
                      {current.time}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="text-white/70 leading-relaxed text-sm lg:text-base whitespace-pre-line text-justify">
                    <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-room-content-${current.id}`}>
                      {getFullContent()}
                    </AnimatedText>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setIsBookingOpen(true)}
                      className="flex-1 lg:flex-none px-8 py-4 bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors rounded-sm"
                    >
                      <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-btn-booking`}>
                        {t('hero.button')}
                      </AnimatedText>
                    </button>
                    <div className="flex gap-2 lg:hidden">
                        <button onClick={() => paginate(-1)} className="p-4 bg-white/5 border border-white/10 rounded-sm"><ChevronLeft className="w-5 h-5"/></button>
                        <button onClick={() => paginate(1)} className="p-4 bg-white/5 border border-white/10 rounded-sm"><ChevronRight className="w-5 h-5"/></button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}