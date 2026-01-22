"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import BookingModal from "./modal/booking-modal"

export default function InstructionsBlock() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const steps = [
    {
      id: 1,
      titleKey: 'instructions.step1.title',
      descriptionKey: 'instructions.step1.description',
      detailsKey: 'instructions.step1.details',
    },
    {
      id: 2,
      titleKey: 'instructions.step2.title',
      descriptionKey: 'instructions.step2.description',
      detailsKey: 'instructions.step2.details',
    },
    {
      id: 3,
      titleKey: 'instructions.step3.title',
      descriptionKey: 'instructions.step3.description',
      detailsKey: 'instructions.step3.details',
    },
  ]

  const currentStepData = steps[currentStep]
  const details = t(currentStepData.detailsKey, { returnObjects: true }) as string[]

  return (
    <>
      <section id="instructions" className="min-h-screen bg-red-900 flex items-center pt-24 pb-12 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Title */}
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                {t("instructions.title")}
                <br />
                {t("instructions.subtitle")}
              </h2>
            </div>

            {/* Right - Content Slider */}
            <div className="space-y-8">
              <div className="bg-red-800/50 border-2 border-yellow-400 rounded-xl p-8 lg:p-10">
                <h3 className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-4 lg:mb-6">
                  {t(currentStepData.titleKey)}
                </h3>
                <p className="text-white text-lg lg:text-xl leading-relaxed mb-6 lg:mb-8">
                  {t(currentStepData.descriptionKey)}
                </p>

                {/* Details List */}
                <ul className="space-y-3 lg:space-y-4">
                  {details.map((detail, idx) => (
                    <li key={idx} className="flex gap-3 text-white text-base lg:text-lg">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  className="p-3 rounded-full bg-yellow-400 text-red-900 hover:bg-yellow-300 transition"
                >
                  ←
                </button>

                <div className="flex gap-2">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`w-3 h-3 rounded-full transition ${
                        idx === currentStep ? "bg-yellow-400" : "bg-yellow-400/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                  className="p-3 rounded-full bg-yellow-400 text-red-900 hover:bg-yellow-300 transition"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isBookingOpen && <BookingModal onClose={() => setIsBookingOpen(false)} isOpen={isBookingOpen} />}
    </>
  )
}
