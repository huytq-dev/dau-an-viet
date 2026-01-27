"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { reviewsData } from "./reviews-data"

export default function ReviewsBlock() {
  const { t } = useTranslation('common')

  const reviews = reviewsData

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const itemsPerView = 3 

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused, reviews.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }, [reviews.length])

  const getVisibleReviews = useCallback(() => {
    const visible: typeof reviews = []
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % reviews.length
      visible.push(reviews[index])
    }
    return visible
  }, [currentIndex, reviews, itemsPerView])

  return (
    <section id="reviews" className="min-h-screen bg-[#1a0505] flex items-center py-24 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-600 block">
                {t('reviews.subtitle') || "KHÁCH HÀNG NÓI GÌ"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                {t("reviews.title") || "CẢM NHẬN TRẢI NGHIỆM"}
            </h2>
            <div className="h-1 w-20 bg-yellow-600 mx-auto mt-6" />
        </div>

        <div 
          className="relative mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 p-3 rounded-full bg-yellow-600/90 hover:bg-yellow-600 text-black transition-all duration-300 shadow-lg hover:scale-110">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 p-3 rounded-full bg-yellow-600/90 hover:bg-yellow-600 text-black transition-all duration-300 shadow-lg hover:scale-110">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {getVisibleReviews().map((review, index) => {
              const actualIndex = (currentIndex + index) % reviews.length
              return (
                <div
                  key={`${actualIndex}-${currentIndex}`}
                  // --- FIX 1: Thêm h-full để thẻ luôn chiếm hết chiều cao cột ---
                  className="group relative bg-[#2b0a0a] border border-white/5 p-8 rounded-sm hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-500 h-full flex flex-col"
                >
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 rotate-180 group-hover:text-yellow-600/10 transition-colors duration-500" />

                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-600 text-yellow-600" : "fill-white/10 text-white/10"}`} 
                      />
                    ))}
                  </div>

                  {/* --- FIX 2: Cố định chiều cao và giới hạn số dòng --- */}
                  <blockquote className="relative z-10 mb-8 flex-grow">
                    <p className="text-white/80 text-lg font-light italic leading-relaxed line-clamp-4 min-h-[7rem]">
                      "{review.text}"
                    </p>
                  </blockquote>

                  {/* Divider */}
                  <div className="w-12 h-px bg-yellow-600/50 mb-4 mt-auto" />

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold uppercase tracking-wide text-sm group-hover:text-yellow-500 transition-colors line-clamp-1">
                        {review.name}
                      </div>
                      <div className="text-white/30 text-xs font-medium uppercase tracking-widest">
                        Player
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-yellow-600 scale-125" 
                  : "bg-yellow-600/40 hover:bg-yellow-600/60"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}