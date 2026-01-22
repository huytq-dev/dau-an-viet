"use client"

import { useTranslation } from "react-i18next"

export default function ContactBlock() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="min-h-screen bg-red-900 relative overflow-hidden flex items-center py-12">
      <div className="container mx-auto px-4 relative z-10 w-full">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-yellow-400">
          {t("contact.title")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left - Contact Info (Compact) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Email */}
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.email")}</p>
            </div>
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.fanpage")}</p>
            </div>

            {/* Address */}
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.address1")}</p>
            </div>

            {/* Hours */}
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.address2")}</p>
            </div>

            {/* Hotline */}
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.hotline")}</p>
            </div>

            {/* Whatsapp */}
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.whatsapp")}</p>
            </div>

            {/* Zalo */}
            <div className="bg-red-800/50 border border-yellow-400 rounded-lg p-4 hover:bg-red-800/70 transition">
              <p className="text-white text-sm">{t("contact.zalo")}</p>
            </div>
          </div>

          {/* Right - Google Map (Large) */}
          <div className="lg:col-span-2 relative">
            <div className="rounded-xl overflow-hidden border-3 border-yellow-400">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.9876543210!2d108.21999999999999!3d16.0544444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0x1df0cb4b466b3d96!2s114%20B%E1%BA%A1ch%20%C4%90%E1%BA%B1ng%2C%20H%E1%BA%A3i%20Ch%C3%A2u%201%2C%20H%E1%BA%A3i%20Ch%C3%A2u%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng%20550000%2C%20Vietnam!5e0!3m2!1sen!2s!4v1737234567890!5m2!1sen!2s"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Social Links Footer */}
        <div className="flex gap-6 justify-center mt-12 pt-8 border-t border-yellow-400/30">
          <a href="https://www.facebook.com/profile.php?id=61586747937546" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center hover:bg-yellow-400/40 transition" title="Dấu Chân Việt - Monopoly Experience Hub">
            <span className="text-yellow-400">f</span>
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center hover:bg-yellow-400/40 transition">
            <span className="text-yellow-400">📱</span>
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center hover:bg-yellow-400/40 transition">
            <span className="text-yellow-400">✉</span>
          </a>
        </div>
      </div>
    </section>
  )
}
