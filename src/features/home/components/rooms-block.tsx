'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BookingModal from './modal/booking-modal'
import Image from 'next/image'

export default function RoomsBlock() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % roomsData.length)
  }

  const getTitle = () => (currentLanguage === 'vi' ? t(current.titleKey) : t(current.titleEnKey))
  const getFullContent = () => (currentLanguage === 'vi' ? t(current.fullContentKey) : t(current.fullContentEnKey))

  return (
    <>
      {/* SECTION BACKGROUND */}
      <section id="rooms" className="relative min-h-screen flex items-center py-20 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#360808] via-[#1a0505] to-black">
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
              
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[2px] w-12 bg-yellow-500" />
                <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-yellow-500">
                  {t('rooms.title') || "CÁC PHÒNG CHƠI"}
                </h1>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                  {getTitle()}
                </span>
              </h2>

              <div className="flex gap-4 text-xs font-bold tracking-widest text-white/60 py-2 border-y border-white/10">
                 <div className="flex items-center gap-2"><Users className="w-4 h-4 text-yellow-500" /> {current.players} Players</div>
                 <div className="w-[1px] h-4 bg-white/20" />
                 <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500" /> {current.time}</div>
                 <div className="w-[1px] h-4 bg-white/20" />
                 <div className="flex items-center gap-2 text-yellow-500">
                    {'★'.repeat(current.difficulty)}
                    <span className="text-white/20">{'★'.repeat(5 - current.difficulty)}</span>
                 </div>
              </div>

              <div className="relative group">
                <div className="max-h-[200px] lg:max-h-[250px] overflow-y-auto pr-4 
                  scrollbar-thin scrollbar-thumb-yellow-600/50 scrollbar-track-white/5 
                  hover:scrollbar-thumb-yellow-500 text-white/80 text-sm lg:text-base leading-relaxed whitespace-pre-line text-justify">
                  {getFullContent()}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1d0606] to-transparent pointer-events-none lg:hidden" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold uppercase tracking-widest rounded hover:from-yellow-500 hover:to-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform hover:-translate-y-1"
                >
                  {t('hero.button') || "ĐẶT PHÒNG NGAY"}
                </button>
                
                <div className="flex gap-2 lg:hidden">
                    <button onClick={handlePrev} className="p-4 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10"><ChevronLeft /></button>
                    <button onClick={handleNext} className="p-4 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10"><ChevronRight /></button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-7 relative order-1 lg:order-2 flex flex-col items-center justify-center">
              
              <div className="relative w-full max-w-sm lg:max-w-md aspect-[2/3] group perspective-1000">
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-yellow-600 blur-[50px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-xl" />
                
                {/* Main Image Frame */}
                <div className="relative w-full h-full bg-[#0f0303] border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                  
                  {/* Blur Layer */}
                  <Image
                    src={current.image || "/placeholder.svg"}
                    alt={getTitle()}
                    fill
                    className="object-cover blur-xl opacity-40 scale-110"
                  />

                  {/* Main Image - ĐÃ XOÁ class group-hover:scale-105 */}
                  <Image
                    src={current.image || "/placeholder.svg"}
                    alt={getTitle()}
                    fill
                    className="object-cover z-10" 
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                </div>

                {/* Desktop Navigation */}
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

              {/* Dots Indicator */}
              <div className="flex gap-3 mt-10">
                {roomsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'w-10 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' 
                        : 'w-2 bg-white/10 hover:bg-white/40'
                    }`}
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