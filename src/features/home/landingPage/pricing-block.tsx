'use client'

import { useTranslation } from "react-i18next"
import { Clock, GraduationCap, Users } from "lucide-react"
import { AnimatedText } from "@/components/ui/animated-text"
import { cn } from "@/lib/utils"

export default function PricingBlock() {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const pricingRooms = [
    {
      id: 1,
      nameKey: 'pricing.room1.name',
      subtitleKey: 'pricing.room1.subtitle',
      timingsKey: 'pricing.room1.timings',
      regularKey: 'pricing.room1.regular',
      studentKey: 'pricing.room1.student',
      scheduleKey: 'pricing.room1.schedule',
    },
    {
      id: 2,
      nameKey: 'pricing.room2.name',
      subtitleKey: 'pricing.room2.subtitle',
      timingsKey: 'pricing.room2.timings',
      regularKey: 'pricing.room2.regular',
      studentKey: 'pricing.room2.student',
      scheduleKey: 'pricing.room2.schedule',
    },
    {
      id: 3,
      nameKey: 'pricing.room3.name',
      subtitleKey: 'pricing.room3.subtitle',
      timingsKey: 'pricing.room3.timings',
      regularKey: 'pricing.room3.regular',
      studentKey: 'pricing.room3.student',
      scheduleKey: 'pricing.room3.schedule',
    },
  ]

  return (
    // SECTION BACKGROUND: Đồng bộ với RoomsBlock (Radial Gradient Đỏ - Đen)
    <section
      id="pricing"
      className="relative min-h-screen flex items-center py-24 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#360808] via-[#1a0505] to-black overflow-hidden"
    >
      
      {/* Decorative Element: Số nền mờ phía sau */}
      <div className="absolute top-20 right-0 font-black text-[200px] leading-none text-white/5 select-none pointer-events-none">
          $
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-500 block">
                <AnimatedText
                  animationType="fade"
                  dependencyKey={`${currentLanguage}-pricing-subtitle`}
                >
                  {t('pricing.subtitle') || "BẢNG GIÁ DỊCH VỤ"}
                </AnimatedText>
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                <AnimatedText
                  animationType="slideUp"
                  dependencyKey={`${currentLanguage}-pricing-title`}
                >
                  {t('pricing.title') || "CHỌN GÓI TRẢI NGHIỆM"}
                </AnimatedText>
            </h2>
             <div className="h-[2px] w-20 bg-yellow-500 mx-auto mt-6" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {pricingRooms.map((room) => {
            const timings = t(room.timingsKey, { returnObjects: true }) as string[]
            const regular = t(room.regularKey, { returnObjects: true }) as number[]
            const student = t(room.studentKey, { returnObjects: true }) as number[]
            
            return (
              <div
                key={room.id}
                // CARD STYLE: Black/40 và Border đồng bộ với RoomsBlock
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 hover:border-yellow-500/50 rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.1)]"
              >
                
                {/* Card Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-2 group-hover:text-yellow-500 transition-colors">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-pricing-room-name-${room.id}`}
                    >
                      {t(room.nameKey)}
                    </AnimatedText>
                  </h3>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-widest border-b border-white/5 pb-6">
                      <AnimatedText
                        animationType="fade"
                        dependencyKey={`${currentLanguage}-pricing-room-subtitle-${room.id}`}
                      >
                        {t(room.subtitleKey)}
                      </AnimatedText>
                  </p>
                </div>

                {/* Pricing Table */}
                <div className="space-y-6">
                  
                  {/* Column Headers */}
                  <div className="grid grid-cols-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">
                    <div className="text-left">Đối tượng</div>
                    <div>{timings[0]}</div>
                    <div>{timings[1]}</div>
                  </div>

                  {/* Regular Price Row */}
                  <div className="grid grid-cols-3 items-center py-4 border-t border-white/5 hover:bg-white/5 transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-2 text-white font-bold text-sm text-left">
                      <Users className="w-4 h-4 text-yellow-500" />
                      <span>
                        <AnimatedText
                          animationType="fade"
                          dependencyKey={`${currentLanguage}-pricing-regular`}
                        >
                          {t('pricing.regular') || "Người lớn"}
                        </AnimatedText>
                      </span>
                    </div>
                    <div className="text-center text-xl font-bold text-white tabular-nums">{regular[0]}K</div>
                    <div className="text-center text-xl font-bold text-yellow-500 tabular-nums">{regular[1]}K</div>
                  </div>

                  {/* Student Price Row */}
                  <div className="grid grid-cols-3 items-center py-4 border-t border-white/5 hover:bg-white/5 transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-2 text-white font-bold text-sm text-left">
                      <GraduationCap className="w-4 h-4 text-yellow-500" />
                      <span>
                        <AnimatedText
                          animationType="fade"
                          dependencyKey={`${currentLanguage}-pricing-student`}
                        >
                          {t('pricing.student') || "HSSV"}
                        </AnimatedText>
                      </span>
                    </div>
                    <div className="text-center text-xl font-bold text-white tabular-nums">{student[0]}K</div>
                    <div className="text-center text-xl font-bold text-yellow-500 tabular-nums">{student[1]}K</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="mt-8 pt-6 border-t border-dashed border-white/10">
                  <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-500/80 mt-1 flex-shrink-0" />
                      <div>
                          <p className="text-[10px] font-bold uppercase text-yellow-500/80 mb-2 tracking-widest">
                            <AnimatedText
                              animationType="fade"
                              dependencyKey={`${currentLanguage}-pricing-schedule-label-${room.id}`}
                            >
                              {t('pricing.scheduleLabel') || "LỊCH HOẠT ĐỘNG"}
                            </AnimatedText>
                          </p>
                          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line font-light">
                            <AnimatedText
                              animationType="fade"
                              dependencyKey={`${currentLanguage}-pricing-schedule-${room.id}`}
                            >
                              {t(room.scheduleKey)}
                            </AnimatedText>
                          </p>
                      </div>
                  </div>
                </div>

                {/* Hover Line Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl" />
              </div>
            )
          })}
        </div>

        {/* Note Footer */}
        <div className="text-center mt-16 border-t border-white/5 pt-8 max-w-2xl mx-auto">
          <p className="text-white/40 text-sm font-light italic">
            <AnimatedText
              animationType="fade"
              dependencyKey={`${currentLanguage}-pricing-note`}
            >
              * {t('pricing.note') || "Giá vé áp dụng cho một người chơi. Vui lòng mang thẻ HSSV để nhận ưu đãi."}
            </AnimatedText>
          </p>
        </div>

      </div>
    </section>
  )
}