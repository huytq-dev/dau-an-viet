"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert, Lightbulb } from "lucide-react"
import BookingModal from "./modal/booking-modal"
import { cn } from "@/lib/utils"

export default function InstructionsBlock() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const steps = [
    {
      id: 1,
      titleKey: 'instructions.step1.title',
      descriptionKey: 'instructions.step1.description',
      detailsKey: 'instructions.step1.details',
      icon: Lightbulb,
    },
    {
      id: 2,
      titleKey: 'instructions.step2.title',
      descriptionKey: 'instructions.step2.description',
      detailsKey: 'instructions.step2.details',
      icon: CheckCircle2,
    },
    {
      id: 3,
      titleKey: 'instructions.step3.title',
      descriptionKey: 'instructions.step3.description',
      detailsKey: 'instructions.step3.details',
      icon: ShieldAlert,
    },
  ]

  const currentStepData = steps[currentStep]
  const details = t(currentStepData.detailsKey, { returnObjects: true }) as string[]
  const Icon = currentStepData.icon

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  return (
    <>
      {/* SECTION BACKGROUND: Màu Be Nâu Nhạt (Muted Beige) - Đằm mắt, không chói */}
      <section id="instructions" className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#E6E0D4]">
        
        {/* Watermark Number: Màu nâu đất mờ, hòa vào nền giấy cũ */}
        <div className="absolute top-1/2 left-4 lg:left-20 -translate-y-1/2 font-black text-[300px] lg:text-[400px] leading-none text-[#4A3728]/5 select-none pointer-events-none z-0">
            {currentStepData.id}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start lg:items-center">
            
            {/* --- LEFT SIDE: NAVIGATION --- */}
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-2">
                {/* Subtitle: Màu Cam Đất/Đồng */}
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#9A3412] block mb-2">
                    {t("instructions.subtitle") || "HƯỚNG DẪN"}
                </span>
                {/* Title: Màu Đỏ Gạch Trầm (Brick Red) */}
                <h2 className="text-4xl lg:text-5xl font-bold text-[#7F1D1D] uppercase tracking-tight">
                    {t("instructions.title") || "CÁCH THỨC\nTHAM GIA"}
                </h2>
              </div>
              
              {/* Minimalist List Navigation */}
              <div className="hidden lg:flex flex-col gap-0 border-l border-[#7F1D1D]/20 pl-6">
                  {steps.map((step, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={cn(
                            "group text-left py-4 transition-all duration-300 relative",
                            currentStep === idx ? "opacity-100" : "opacity-50 hover:opacity-80"
                        )}
                      >
                          {/* Active Indicator: Màu Đỏ Gạch */}
                          {currentStep === idx && (
                              <span className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#7F1D1D]" />
                          )}
                          
                          <div className="flex items-center gap-3">
                              <span className={cn(
                                  "text-lg font-bold tabular-nums", 
                                  // Số thứ tự: Active là màu Đỏ, Inactive là màu nâu đen
                                  currentStep === idx ? "text-[#7F1D1D]" : "text-[#2D2D2D]"
                              )}>
                                  0{step.id}
                              </span>
                              <span className="text-sm font-bold tracking-wider uppercase text-[#2D2D2D]">
                                  {t(step.titleKey)}
                              </span>
                          </div>
                      </button>
                  ))}
              </div>
            </div>

            {/* --- RIGHT SIDE: CONTENT CARD --- */}
            <div className="lg:col-span-8 relative">
                
                {/* Main Card: Nền Trắng Gạo (Off-white) - Dịu hơn trắng tinh */}
                <div className="relative bg-[#FAF9F6] border border-[#7F1D1D]/10 rounded-sm p-8 lg:p-12 shadow-xl shadow-[#4A3728]/10">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        {/* Icon Box: Nền kem đậm */}
                        <div className="p-3 bg-[#E6E0D4] text-[#9A3412] rounded-sm border border-[#9A3412]/20">
                             <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        {/* Title: Màu Đỏ Gạch */}
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#7F1D1D] uppercase tracking-wide">
                             {t(currentStepData.titleKey)}
                        </h3>
                    </div>

                    {/* Description: Màu Nâu Đen */}
                    <p className="text-lg text-[#333333] leading-relaxed mb-8 font-light">
                        {t(currentStepData.descriptionKey)}
                    </p>

                    {/* Details List */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-[#4A4A4A] py-3 border-t border-[#7F1D1D]/10">
                                {/* Bullet: Màu Cam Đất */}
                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#9A3412] flex-shrink-0" />
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Navigation */}
                    <div className="flex items-center justify-between pt-8 mt-4 lg:hidden">
                        <button onClick={handlePrev} className="text-[#333333]/50 hover:text-[#9A3412] transition-colors">
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <span className="text-sm font-bold text-[#9A3412] tracking-widest">
                            0{currentStepData.id} / 0{steps.length}
                        </span>
                        <button onClick={handleNext} className="text-[#333333]/50 hover:text-[#9A3412] transition-colors">
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                </div>
            </div>
          </div>
        </div>
      </section>

      {isBookingOpen && <BookingModal onClose={() => setIsBookingOpen(false)} isOpen={isBookingOpen} />}
    </>
  )
}