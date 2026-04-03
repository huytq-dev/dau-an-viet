"use client"

import { useTranslation } from "react-i18next"
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle } from "lucide-react"
import { AnimatedText } from "@/components/ui/animated-text"

export default function ContactBlock() {
  const { t, i18n } = useTranslation('common')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  return (
    // SECTION BACKGROUND: Chuyển sang màu Be Nâu Nhạt (Muted Beige) giống InstructionsBlock
    <section id="contact" className="relative min-h-screen flex items-center py-24 bg-[#E6E0D4] overflow-hidden">

      {/* Decorative: Họa tiết chấm bi mờ màu nâu đất */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#4A3728 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#9A3412] block">
            <AnimatedText
              animationType="fade"
              dependencyKey={`${currentLanguage}-contact-subtitle`}
            >
              {t('contact.subtitle')}
            </AnimatedText>
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-[#7F1D1D] uppercase tracking-tight">
            <AnimatedText
              animationType="slideUp"
              dependencyKey={`${currentLanguage}-contact-title`}
            >
              {t("contact.title")}
            </AnimatedText>
          </h2>
          {/* Line separator: Màu Đỏ Gạch */}
          <div className="h-1 w-20 bg-[#7F1D1D] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* LEFT COLUMN: Contact Info List - Nền Trắng Gạo (Off-white) */}
          <div className="lg:col-span-5 space-y-8 bg-[#FAF9F6] p-8 lg:p-10 rounded-sm border border-[#7F1D1D]/10 shadow-xl shadow-[#4A3728]/5">

            <h3 className="text-2xl font-bold text-[#7F1D1D] uppercase mb-6 tracking-wide">
              <AnimatedText
                animationType="fade"
                dependencyKey={`${currentLanguage}-contact-info`}
              >
                {t("contact.info")}
              </AnimatedText>
            </h3>

            <div className="space-y-6">
              {/* Item Template Function cho gọn (hoặc viết trực tiếp) */}
              {[
                { icon: MapPin, label: "contact.address", value: "contact.address1" },
                { icon: Phone, label: "contact.hotlineZalo", value: "contact.hotline", subValue: "contact.zalo" },
                { icon: Mail, label: "contact.emailLabel", value: "contact.email" },
                { icon: Clock, label: "contact.workingHours", value: "contact.workingHoursValue" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="p-3 bg-[#E6E0D4] rounded-sm text-[#9A3412] group-hover:bg-[#7F1D1D] group-hover:text-white transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A3728]/60 uppercase tracking-widest mb-1">
                      <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-label-${index}`}>
                        {t(item.label)}
                      </AnimatedText>
                    </p>
                    <p className="text-[#333333] text-sm font-bold leading-relaxed">
                      <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-value-${index}`}>
                        {t(item.value)}
                      </AnimatedText>
                    </p>
                    {item.subValue && (
                       <p className="text-[#4A3728]/70 text-xs mt-1">
                        <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-sub-value-${index}`}>
                          {t(item.subValue)}
                        </AnimatedText>
                     </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Buttons */}
            <div className="pt-8 mt-8 border-t border-[#7F1D1D]/10 flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61586747937546" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#3b5998] hover:bg-[#2d4373] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors shadow-lg shadow-[#3b5998]/20">
                <Facebook className="w-4 h-4" />
                <span>{t("Facebook")}</span>
              </a>
              <a href="#" className="flex-1 py-3 bg-[#0068FF] hover:bg-[#0051c9] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors shadow-lg shadow-[#0068FF]/20">
                <MessageCircle className="w-4 h-4" />
                <span>{t("Zalo")}</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Google Map */}
          <div className="lg:col-span-7 h-full min-h-[500px] relative rounded-sm overflow-hidden border border-[#7F1D1D]/10 shadow-xl shadow-[#4A3728]/5 group">
            {/* Overlay nhẹ màu nâu gỗ khi chưa hover */}
            <div className="absolute inset-0 bg-[#4A3728]/5 pointer-events-none group-hover:bg-transparent transition-colors z-10" />

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3834.6147969554336!2d108.2359806765988!3d16.033555584640737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDAyJzAwLjgiTiAxMDjCsDE0JzE4LjgiRQ!5e0!3m2!1sen!2s!4v1769679055896!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>

      </div>
    </section>
  )
}