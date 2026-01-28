'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Users, Clock, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BookingModal from './modal/booking-modal'
import Image from 'next/image'
import { AnimatedText } from "@/components/ui/animated-text"
import { cn } from "@/lib/utils"

export default function RoomsBlock() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  // Ref cho việc vuốt
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const roomsData = [
    {
      id: 1,
      titleKey: 'rooms.room1.title',
      titleEnKey: 'rooms.room1.titleEn',
      descKey: 'rooms.room1.desc',
      descEnKey: 'rooms.room1.descEn',
      fullContentKey: 'rooms.room1.fullContent',
      fullContentEnKey: 'rooms.room1.fullContentEn',
      image: '/images/room1-mienn-dat-viet.png',
      difficulty: 4, 
      players: '2-6',
      time: '60m'
    },
    {
      id: 2,
      titleKey: 'rooms.room2.title',
      titleEnKey: 'rooms.room2.titleEn',
      descKey: 'rooms.room2.desc',
      descEnKey: 'rooms.room2.descEn',
      fullContentKey: 'rooms.room2.fullContent',
      fullContentEnKey: 'rooms.room2.fullContentEn',
      image: '/images/room2-lang-viet-song.png',
      difficulty: 5,
      players: '4-8',
      time: '90m'
    },
    {
      id: 3,
      titleKey: 'rooms.room3.title',
      titleEnKey: 'rooms.room3.titleEn',
      descKey: 'rooms.room3.desc',
      descEnKey: 'rooms.room3.descEn',
      fullContentKey: 'rooms.room3.fullContent',
      fullContentEnKey: 'rooms.room3.fullContentEn',
      image: '/images/room3-lang-nghe.png',
      difficulty: 3,
      players: '2-5',
      time: '45m'
    },
  ]

  const current = roomsData[currentIndex]

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length)
  }, [roomsData.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % roomsData.length)
  }, [roomsData.length])

  // --- Logic Vuốt (Swipe) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      handleNext()
    } else if (distance < -minSwipeDistance) {
      handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }
  // ---------------------------

  const getTitle = () => (currentLanguage === 'vi' ? t(current.titleKey) : t(current.titleEnKey))
  const getFullContent = () => (currentLanguage === 'vi' ? t(current.fullContentKey) : t(current.fullContentEnKey))

  return (
    <>
      <section 
        id="rooms" 
        className="relative min-h-[90vh] flex items-center py-12 lg:py-20 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#360808] via-[#1a0505] to-black"
        // Thêm handler vuốt cho cả section
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-64 h-64 lg:w-96 lg:h-96 bg-red-600/10 rounded-full blur-[80px] lg:blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 lg:w-96 lg:h-96 bg-yellow-600/10 rounded-full blur-[80px] lg:blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
            
            {/* RIGHT COLUMN (IMAGE) - Mobile: Order 1 (Lên đầu) */}
            <div className="lg:col-span-7 relative order-1 lg:order-2 flex flex-col items-center justify-center">
              
              {/* Image Container: 
                  - Mobile: max-w-[85%] để không quá to, aspect-[3/4] ngắn hơn 1 chút.
                  - Desktop: max-w-md, aspect-[2/3].
              */}
              <div className="relative w-full max-w-[85%] sm:max-w-sm lg:max-w-md aspect-[3/4] lg:aspect-[2/3] group perspective-1000 transition-all duration-500">
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-yellow-600 blur-[40px] lg:blur-[50px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-xl" />
                
                {/* Main Image Frame */}
                <div className="relative w-full h-full bg-[#0f0303] border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 select-none">
                  
                  {/* Blur Background Layer */}
                  <Image
                    src={current.image || "/placeholder.svg"}
                    alt={getTitle()}
                    fill
                    className="object-cover blur-xl opacity-40 scale-110"
                  />

                  {/* Main Image */}
                  <Image
                    src={current.image || "/placeholder.svg"}
                    alt={getTitle()}
                    fill
                    className="object-cover z-10" 
                    priority
                    sizes="(max-width: 768px) 80vw, 40vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                </div>

                {/* Desktop Navigation Arrows (Hidden on Mobile) */}
                <button
                  onClick={handlePrev}
                  className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all backdrop-blur-md z-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all backdrop-blur-md z-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Dots (Visible below image on mobile) */}
              <div className="flex gap-2 mt-6 lg:hidden">
                {roomsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      idx === currentIndex 
                        ? "w-8 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                        : "w-2 bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* LEFT COLUMN (CONTENT) - Mobile: Order 2 (Xuống dưới) */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6 order-2 lg:order-1 mt-2 lg:mt-0">
              
              {/* Header nhỏ */}
              <div className="flex items-center gap-3 lg:gap-4 mb-1">
                <div className="h-[2px] w-8 lg:w-12 bg-yellow-500" />
                <h1 className="text-xs lg:text-sm font-bold tracking-[0.3em] uppercase text-yellow-500">
                  <AnimatedText
                    animationType="fade"
                    dependencyKey={`${currentLanguage}-rooms-title`}
                  >
                    {t('rooms.title') || "CÁC PHÒNG CHƠI"}
                  </AnimatedText>
                </h1>
              </div>

              {/* Tên phòng lớn */}
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight uppercase drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                  <AnimatedText
                    animationType="slideUp"
                    dependencyKey={`${currentLanguage}-rooms-room-title-${current.id}`}
                  >
                    {getTitle()}
                  </AnimatedText>
                </span>
              </h2>

              {/* Thông số (Players, Time, Difficulty) */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] lg:text-xs font-bold tracking-widest text-white/60 py-2 border-y border-white/10">
                 <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-yellow-500" /> {current.players} Players</div>
                 <div className="hidden sm:block w-[1px] h-3 bg-white/20" />
                 <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-yellow-500" /> {current.time}</div>
                 <div className="hidden sm:block w-[1px] h-3 bg-white/20" />
                 <div className="flex items-center gap-1 text-yellow-500">
                   {/* Dùng Star icon thay vì ký tự text để đồng bộ */}
                   {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn("w-3 h-3", i < current.difficulty ? "fill-yellow-500 text-yellow-500" : "fill-white/10 text-white/10")} 
                      />
                   ))}
                 </div>
              </div>

              {/* Nội dung mô tả (Có scroll) */}
              <div className="relative group">
                {/* Mobile: max-h-[150px] để không đẩy nút xuống quá sâu */}
                <div className="max-h-[150px] lg:max-h-[250px] overflow-y-auto pr-2 lg:pr-4 
                  scrollbar-thin scrollbar-thumb-yellow-600/50 scrollbar-track-white/5 
                  hover:scrollbar-thumb-yellow-500 text-white/80 text-sm lg:text-base leading-relaxed whitespace-pre-line text-justify">
                  <AnimatedText
                    animationType="fade"
                    dependencyKey={`${currentLanguage}-rooms-room-content-${current.id}`}
                  >
                    {getFullContent()}
                  </AnimatedText>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-6 lg:h-8 bg-gradient-to-t from-[#1d0606] to-transparent pointer-events-none lg:hidden" />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 lg:pt-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="flex-1 px-6 py-3.5 lg:px-8 lg:py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold uppercase tracking-widest rounded hover:from-yellow-500 hover:to-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform hover:-translate-y-1 text-sm lg:text-base active:scale-95 duration-200"
                >
                  <AnimatedText
                    animationType="fade"
                    dependencyKey={`${currentLanguage}-rooms-booking`}
                  >
                    {t('hero.button') || "ĐẶT PHÒNG NGAY"}
                  </AnimatedText>
                </button>
                
                {/* Mobile Navigation Buttons (Phòng khi người dùng không biết vuốt) */}
                <div className="flex gap-2 lg:hidden">
                    <button onClick={handlePrev} className="flex-1 p-3.5 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10 active:bg-white/20 transition-colors flex justify-center items-center">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNext} className="flex-1 p-3.5 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10 active:bg-white/20 transition-colors flex justify-center items-center">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
              </div>
              
              {/* Desktop Dots Indicator */}
              <div className="hidden lg:flex gap-3 mt-6">
                {roomsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      idx === currentIndex 
                        ? "w-10 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                        : "w-2 bg-white/10 hover:bg-white/40"
                    )}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}