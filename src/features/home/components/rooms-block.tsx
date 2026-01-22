'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    },
  ]

  const current = roomsData[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % roomsData.length)
  }

  const getTitle = () => {
    return currentLanguage === 'vi' 
      ? t(current.titleKey) 
      : t(current.titleEnKey)
  }

  const getFullContent = () => {
    return currentLanguage === 'vi'
      ? t(current.fullContentKey)
      : t(current.fullContentEnKey)
  }

  return (
    <>
      <section id="rooms" className="h-screen bg-red-900 flex items-center pt-20 pb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-white text-left mb-6">
            {t('rooms.title')}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left - Content */}
            <div className="space-y-3 lg:space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-4 
              scrollbar-thin scrollbar-thumb-yellow-400/60 scrollbar-track-transparent 
              hover:scrollbar-thumb-yellow-400 scroll-smooth
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-yellow-400/60
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-yellow-400">
              <h2 className="text-2xl lg:text-3xl font-bold text-yellow-400 sticky top-0 bg-red-900 pb-1 z-10">
                {getTitle()}
              </h2>
              <p className="text-white text-sm lg:text-base leading-relaxed whitespace-pre-line">
                {getFullContent()}
              </p>
            </div>

            {/* Right - Image with Navigation Buttons */}
            <div className="relative flex items-center gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="hidden lg:flex p-3 rounded-full bg-yellow-400 text-red-900 hover:bg-yellow-300 transition shadow-lg z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image Container */}
              <div className="flex-1 relative h-[350px] lg:h-[calc(100vh-280px)] max-h-[500px] p-3 border-4 border-yellow-400 rounded-2xl bg-gradient-to-br from-red-800/30 to-red-900/50 shadow-2xl">
                <Image
                  src={current.image || "/placeholder.svg"}
                  alt={getTitle()}
                  fill
                  className="object-contain rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Mobile Navigation Buttons - overlay on image */}
                <button
                  onClick={handlePrev}
                  className="lg:hidden absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-yellow-400/90 text-red-900 hover:bg-yellow-300 transition shadow-lg z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="lg:hidden absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-yellow-400/90 text-red-900 hover:bg-yellow-300 transition shadow-lg z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="hidden lg:flex p-3 rounded-full bg-yellow-400 text-red-900 hover:bg-yellow-300 transition shadow-lg z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Button and Navigation aligned with slide border */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8  items-center">
            {/* Left - Button aligned with left content */}
            <div className="flex items-center">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full px-6 py-3 mt-[-20px] bg-yellow-400 text-red-900 rounded-lg hover:bg-yellow-300 transition font-semibold text-lg shadow-2xl">
                {t('hero.button')}
              </button>
            </div>

            {/* Right - Navigation aligned with slide */}
            <div className="flex items-center justify-between px-4">
           
              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-3 flex-1">
                {roomsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-4 h-4 rounded-full transition ${
                      idx === currentIndex ? 'bg-yellow-400 scale-125' : 'bg-yellow-400/40'
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
