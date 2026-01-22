"use client"

import { useTranslation } from "react-i18next"

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
    <section
      id="pricing"
      className="min-h-screen bg-red-900 flex items-center py-24 relative overflow-hidden"
    >
      {/* Background Image */}
      {/* Note: pricing-table.jpg not found - background image removed */}
      {/* <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/pricing-table.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      /> */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-12">
          {t('pricing.title')}
        </h2>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingRooms.map((room) => {
            const timings = t(room.timingsKey, { returnObjects: true }) as string[]
            const regular = t(room.regularKey, { returnObjects: true }) as number[]
            const student = t(room.studentKey, { returnObjects: true }) as number[]
            
            return (
              <div
                key={room.id}
                className="bg-red-800/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl p-6 lg:p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                {/* Card Header */}
                <div className="text-center mb-6 pb-6 border-b-2 border-yellow-400/30">
                  <h3 className="text-2xl lg:text-3xl font-bold text-yellow-400 mb-2">
                    {t(room.nameKey)}
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base">{t(room.subtitleKey)}</p>
                </div>

                {/* Pricing Table */}
                <div className="space-y-4 mb-6">
                  {/* Header Row */}
                  <div className="grid grid-cols-3 gap-2 text-center pb-3 border-b border-yellow-400/30">
                    <div className="text-yellow-400 font-semibold text-sm"></div>
                    <div className="text-yellow-400 font-semibold text-sm">{timings[0]}</div>
                    <div className="text-yellow-400 font-semibold text-sm">{timings[1]}</div>
                  </div>

                  {/* Regular Price Row */}
                  <div className="grid grid-cols-3 gap-2 text-center items-center">
                    <div className="text-white text-sm font-medium text-left">
                      {t('pricing.regular')}
                    </div>
                    <div className="text-white text-lg font-bold">{regular[0]}K</div>
                    <div className="text-white text-lg font-bold">{regular[1]}K</div>
                  </div>

                  {/* Student Price Row */}
                  <div className="grid grid-cols-3 gap-2 text-center items-center">
                    <div className="text-white text-sm font-medium text-left">
                      {t('pricing.student')}
                    </div>
                    <div className="text-white text-lg font-bold">{student[0]}K</div>
                    <div className="text-white text-lg font-bold">{student[1]}K</div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-red-900/50 rounded-lg p-4 mt-6">
                  <p className="text-yellow-400 font-semibold text-sm mb-2">
                    {t('pricing.scheduleLabel')}
                  </p>
                  <p className="text-white text-xs lg:text-sm whitespace-pre-line leading-relaxed">
                    {t(room.scheduleKey)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div className="text-center mt-12">
          <p className="text-white/80 text-sm lg:text-base">
            {t('pricing.note')}
          </p>
        </div>
      </div>
    </section>
  )
}
