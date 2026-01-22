"use client"

import { useTranslation } from "react-i18next"

export default function ReviewsBlock() {
  const { t } = useTranslation()

  const reviews = t("reviews.items", { returnObjects: true }) as Array<{
    name: string
    rating: number
    text: string
  }>

  return (
    <section id="reviews" className="min-h-screen bg-red-900 flex items-center pt-24 pb-12">
      <div className="container mx-auto px-4 relative z-10 w-full">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-yellow-400">
          {t("reviews.title")}
        </h2>

        {/* Reviews Cards - 3 static cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-red-800/50 border-2 border-yellow-400 rounded-xl p-8 h-full flex flex-col justify-between hover:bg-red-800/70 transition relative"
            >
              {/* Left border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-400 rounded-l-xl" />

              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-yellow-100 text-base mb-6 italic leading-relaxed flex-grow">
                "{review.text}"
              </p>

              {/* Reviewer Name */}
              <div className="text-yellow-400 font-bold text-lg">- {review.name}</div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10 transition font-semibold">
            {t("reviews.view_more")}
          </button>
        </div>
      </div>
    </section>
  )
}
