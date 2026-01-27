"use client"

import { useTranslation } from "react-i18next"
import { Clock, GraduationCap, Users } from "lucide-react"

export default function PricingBlock() {
  const { t, i18n } = useTranslation()

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
    // SECTION BACKGROUND: Màu Nâu Cà Phê Đậm (Dark Coffee) - Xen kẽ với màu Be sáng ở trên
    <section
      id="pricing"
      className="relative min-h-screen flex items-center py-24 bg-[#1F1612] overflow-hidden"
    >
      
      {/* Decorative Element: Số nền mờ phía sau */}
      <div className="absolute top-20 right-0 font-black text-[200px] leading-none text-white/5 select-none pointer-events-none">
          $
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B45309] block">
                {t('pricing.subtitle') || "BẢNG GIÁ DỊCH VỤ"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                {t('pricing.title') || "CHỌN GÓI TRẢI NGHIỆM"}
            </h2>
             <div className="h-1 w-20 bg-[#B45309] mx-auto mt-6" />
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
                // CARD STYLE: Nền Nâu Đất (Dark Earth), Viền sáng nhẹ
                className="group relative bg-[#2A201C] border border-white/5 hover:border-[#B45309]/50 rounded-sm p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
              >
                
                {/* Card Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#D4A373] uppercase tracking-wide mb-2 group-hover:text-[#E6C29F] transition-colors">
                    {t(room.nameKey)}
                  </h3>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-widest border-b border-white/5 pb-6">
                      {t(room.subtitleKey)}
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
                      <Users className="w-4 h-4 text-[#B45309]" />
                      <span>{t('pricing.regular') || "Người lớn"}</span>
                    </div>
                    <div className="text-center text-xl font-bold text-white tabular-nums">{regular[0]}K</div>
                    <div className="text-center text-xl font-bold text-[#D4A373] tabular-nums">{regular[1]}K</div>
                  </div>

                  {/* Student Price Row */}
                  <div className="grid grid-cols-3 items-center py-4 border-t border-white/5 hover:bg-white/5 transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-2 text-white font-bold text-sm text-left">
                      <GraduationCap className="w-4 h-4 text-[#B45309]" />
                      <span>{t('pricing.student') || "HSSV"}</span>
                    </div>
                    <div className="text-center text-xl font-bold text-white tabular-nums">{student[0]}K</div>
                    <div className="text-center text-xl font-bold text-[#D4A373] tabular-nums">{student[1]}K</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="mt-8 pt-6 border-t border-dashed border-white/10">
                  <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#B45309]/80 mt-1 flex-shrink-0" />
                      <div>
                          <p className="text-[10px] font-bold uppercase text-[#B45309]/80 mb-2 tracking-widest">
                            {t('pricing.scheduleLabel') || "LỊCH HOẠT ĐỘNG"}
                          </p>
                          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line font-light">
                            {t(room.scheduleKey)}
                          </p>
                      </div>
                  </div>
                </div>

                {/* Hover Line Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#B45309] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            )
          })}
        </div>

        {/* Note Footer */}
        <div className="text-center mt-16 border-t border-white/5 pt-8 max-w-2xl mx-auto">
          <p className="text-white/40 text-sm font-light italic">
            * {t('pricing.note') || "Giá vé áp dụng cho một người chơi. Vui lòng mang thẻ HSSV để nhận ưu đãi."}
          </p>
        </div>

      </div>
    </section>
  )
}