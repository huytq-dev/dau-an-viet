"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedText } from "@/components/ui/animated-text"
import { cn } from "@/lib/utils"

export default function ReviewsBlock() {
  const { t, i18n } = useTranslation('common')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const reviews = t('reviews.items', { returnObjects: true }) as { name: string; rating: number; text: string }[]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [itemsPerView, setItemsPerView] = useState(1)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2)
      } else {
        setItemsPerView(1)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }, [reviews.length])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(handleNext, 5000)
    return () => clearInterval(interval)
  }, [isPaused, handleNext])

  const getVisibleReviews = useCallback(() => {
    const visible: typeof reviews = []
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % reviews.length
      visible.push(reviews[index])
    }
    return visible
  }, [currentIndex, reviews, itemsPerView])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    if (distance > 50) handleNext()
    else if (distance < -50) handlePrev()
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section id="reviews" className="min-h-[80vh] bg-[#1a0505] flex items-center py-16 sm:py-24 relative overflow-hidden scroll-mt-20">

      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-red-900/10 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-yellow-600 block">
            <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-reviews-subtitle`}>
              {t('reviews.subtitle') || "KHÁCH HÀNG NÓI GÌ"}
            </AnimatedText>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            <AnimatedText animationType="slideUp" dependencyKey={`${currentLanguage}-reviews-title`}>
              {t("reviews.title") || "CẢM NHẬN TRẢI NGHIỆM"}
            </AnimatedText>
          </h2>
          <div className="h-0.5 sm:h-1 w-16 sm:w-20 bg-yellow-600 mx-auto mt-4 sm:mt-6" />
        </div>

        {/* Carousel Area */}
        <div
          className="relative mb-8 sm:mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 w-12 h-12 items-center justify-center rounded-full bg-[#2b0a0a] border border-yellow-600/30 text-yellow-500 hover:bg-yellow-600 hover:text-black transition-all duration-300 shadow-xl hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 w-12 h-12 items-center justify-center rounded-full bg-[#2b0a0a] border border-yellow-600/30 text-yellow-500 hover:bg-yellow-600 hover:text-black transition-all duration-300 shadow-xl hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Grid Layout Dynamic */}
          <div
            className={cn(
              "grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-500 ease-in-out",
              itemsPerView === 1 ? "grid-cols-1" : itemsPerView === 2 ? "grid-cols-2" : "grid-cols-3"
            )}
          >
            {getVisibleReviews().map((review, index) => {
              const uniqueKey = `${review.name}-${index}-${currentIndex}`
              return (
                <div
                  key={uniqueKey}
                  className="group relative bg-[#2b0a0a] border border-white/5 p-6 sm:p-8 rounded-xl sm:rounded-sm hover:border-yellow-600/20 transition-all duration-500 h-full flex flex-col animate-in fade-in zoom-in-95 duration-300"
                >
                  <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 text-white/5 rotate-180 group-hover:text-yellow-600/10 transition-colors duration-500" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4 sm:mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < review.rating ? "fill-yellow-600 text-yellow-600" : "fill-white/10 text-white/10"}`}
                      />
                    ))}
                  </div>

                  <blockquote className="relative z-10 mb-6 sm:mb-8 flex-grow">
                    <p className="text-white/80 text-base sm:text-lg font-light italic leading-relaxed line-clamp-5 min-h-[6rem] sm:min-h-[7rem]">
                      "{review.text}"
                    </p>
                  </blockquote>

                  <div className="w-8 sm:w-12 h-px bg-yellow-600/50 mb-4 mt-auto" />

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-yellow-600 font-bold text-xs sm:text-sm flex-shrink-0 shadow-inner">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold uppercase tracking-wide text-xs sm:text-sm group-hover:text-yellow-500 transition-colors line-clamp-1">
                        {review.name}
                      </span>
                      <span className="text-white/30 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                        Player
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Counter + Mobile Navigation */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[#2b0a0a] border border-yellow-600/30 text-yellow-500 hover:bg-yellow-600 hover:text-black transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-white/40 text-sm font-bold tabular-nums tracking-widest">
            {String(currentIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
          </span>

          <button
            onClick={handleNext}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[#2b0a0a] border border-yellow-600/30 text-yellow-500 hover:bg-yellow-600 hover:text-black transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  )
}
