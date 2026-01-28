"use client"

import { useTranslation } from "react-i18next"
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle } from "lucide-react"
import { AnimatedText } from "@/components/ui/animated-text"

export default function ContactBlock() {
  const { t, i18n } = useTranslation('common')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  return (
    // SECTION BACKGROUND: Màu Đỏ đen tối (Matte Dark Red) - Kết thúc trang web
    <section id="contact" className="relative min-h-screen flex items-center py-24 bg-[#2b0a0a] overflow-hidden">

      {/* Decorative: Bản đồ thế giới mờ phía sau (nếu có ảnh) hoặc chấm bi trang trí */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-600 block">
            <AnimatedText
              animationType="fade"
              dependencyKey={`${currentLanguage}-contact-subtitle`}
            >
              {t('contact.subtitle')}
            </AnimatedText>
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            <AnimatedText
              animationType="slideUp"
              dependencyKey={`${currentLanguage}-contact-title`}
            >
              {t("contact.title")}
            </AnimatedText>
          </h2>
          <div className="h-1 w-20 bg-yellow-600 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* LEFT COLUMN: Contact Info List (Minimalist Style) */}
          <div className="lg:col-span-5 space-y-8 bg-[#1a0505] p-8 lg:p-10 rounded-sm border border-white/5 shadow-2xl">

            <h3 className="text-2xl font-bold text-yellow-500 uppercase mb-6 tracking-wide">
              <AnimatedText
                animationType="fade"
                dependencyKey={`${currentLanguage}-contact-info`}
              >
                {t("contact.info")}
              </AnimatedText>
            </h3>

            <div className="space-y-6">
              {/* Address 1 */}
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-sm text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-address-label`}
                    >
                      {t("contact.address")}
                    </AnimatedText>
                  </p>
                  <p className="text-white/90 text-sm font-medium leading-relaxed">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-address1`}
                    >
                      {t("contact.address1")}
                    </AnimatedText>
                  </p>
                </div>
              </div>

              {/* Address 2 / Note */}
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-sm text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-facility2-label`}
                    >
                      {t("contact.facility2")}
                    </AnimatedText>
                  </p>
                  <p className="text-white/90 text-sm font-medium leading-relaxed">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-address2`}
                    >
                      {t("contact.address2")}
                    </AnimatedText>
                  </p>
                </div>
              </div>

              {/* Hotline & Whatsapp */}
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-sm text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-hotlinezalo-label`}
                    >
                      {t("contact.hotlineZalo")}
                    </AnimatedText>
                  </p>
                  <p className="text-white/90 text-sm font-bold tracking-wide">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-hotline`}
                    >
                      {t("contact.hotline")}
                    </AnimatedText>
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-zalo`}
                    >
                      {t("contact.zalo")}
                    </AnimatedText>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-sm text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-email-label`}
                    >
                      {t("contact.emailLabel")}
                    </AnimatedText>
                  </p>
                  <p className="text-white/90 text-sm font-medium">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-email`}
                    >
                      {t("contact.email")}
                    </AnimatedText>
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-sm text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-workinghours-label`}
                    >
                      {t("contact.workingHours")}
                    </AnimatedText>
                  </p>
                  <p className="text-white/90 text-sm font-medium">
                    <AnimatedText
                      animationType="fade"
                      dependencyKey={`${currentLanguage}-contact-workinghours`}
                    >
                      {t("contact.workingHoursValue")}
                    </AnimatedText>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Buttons (Small) */}
            <div className="pt-8 mt-8 border-t border-white/5 flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61586747937546" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#3b5998] hover:bg-[#4c70ba] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors">
                <Facebook className="w-4 h-4" />
                <AnimatedText
                  animationType="fade"
                  dependencyKey={`${currentLanguage}-contact-facebook`}
                >
                  {t("Facebook")}
                </AnimatedText>
              </a>
              <a href="#" className="flex-1 py-3 bg-[#0068FF] hover:bg-[#0054cc] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors">
                <MessageCircle className="w-4 h-4" />
                <AnimatedText
                  animationType="fade"
                  dependencyKey={`${currentLanguage}-contact-zalo-label`}
                >
                  {t("Zalo")}
                </AnimatedText>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Google Map (Full Height) */}
          <div className="lg:col-span-7 h-full min-h-[500px] relative rounded-sm overflow-hidden border border-white/10 shadow-2xl group">
            {/* Overlay lúc chưa hover để map chìm vào nền tối */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none group-hover:bg-transparent transition-colors z-10" />

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8021671234567!2d108.2123456!3d16.0678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDA0JzAzLjYiTiAxMDjCsDEyJzQ0LjUiRQ!5e0!3m2!1svi!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-500" // Hiệu ứng: Map đen trắng -> có màu khi hover
            />
          </div>
        </div>

      </div>
    </section>
  )
}
