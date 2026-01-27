"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedText } from "@/components/ui/animated-text"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function HomeHeader() {
  const { t, i18n } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const handleScrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault()
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      setIsMobileMenuOpen(false)
    },
    []
  )

  const handleChangeLanguage = useCallback(
    (locale: "vi" | "en") => {
      if (currentLanguage !== locale) {
        i18n.changeLanguage(locale)
        localStorage.setItem("language", locale)
      }
    },
    [currentLanguage, i18n]
  )

  const menuItems = useMemo(() => [
    { label: t("header.menu.home"), id: "hero" },
    { label: t("header.menu.booking"), id: "rooms" },
    { label: t("header.menu.instructions"), id: "instructions" },
    { label: t("header.menu.pricing"), id: "pricing" },
    { label: t("header.menu.reviews"), id: "reviews" },
    { label: t("header.menu.contact"), id: "contact" },
  ], [t])

  return (
    <header
      // --- SỬA ĐỔI QUAN TRỌNG ---
      // 1. h-20: Cố định chiều cao là 80px (giống ảnh mẫu).
      // 2. flex items-center: Căn giữa nội dung theo chiều dọc.
      // 3. Bỏ transition-all kích thước, chỉ giữ màu nền.
      className="fixed top-0 w-full z-50 h-20 flex items-center border-b bg-transparent backdrop-blur-xl border-white/10"
    >
      <div className="container mx-auto px-4 lg:px-6 h-full">
        <nav className="flex items-center h-full">

          {/* LOGO */}
          {/* --- SỬA ĐỔI: Chiều cao cố định h-12 (48px), không đổi khi scroll */}
          <div className="relative flex items-center shrink-0 h-12 w-auto">
            <Image
              src="/images/header/Logo.png"
              alt="Logo"
              width={160}
              height={60}
              priority
              className="w-auto h-full object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          {/* DESKTOP MENU */}
          <NavigationMenu viewport={false} className="hidden md:flex ml-10 xl:ml-16 h-full items-center">
            <NavigationMenuList className="gap-8">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink asChild>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleScrollToSection(e, item.id)}
                      className="text-sm font-bold uppercase tracking-widest text-white/70 transition-colors duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    >
                      <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-${item.id}`}>
                        {item.label}
                      </AnimatedText>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1 text-xs font-bold tracking-wider">
              <button
                onClick={() => handleChangeLanguage("vi")}
                className={`px-2 py-1 transition-colors duration-300 ${currentLanguage === "vi" ? "text-yellow-400" : "text-white/40 hover:text-white"
                  }`}
              >
                VN
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => handleChangeLanguage("en")}
                className={`px-2 py-1 transition-colors duration-300 ${currentLanguage === "en" ? "text-yellow-400" : "text-white/40 hover:text-white"
                  }`}
              >
                EN
              </button>
            </div>

            {/* Mobile Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white/80 hover:text-white hover:bg-transparent">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black/95 border-l border-white/10 p-0 w-[80%] max-w-[300px]">
                <div className="flex flex-col h-full pt-20 px-8">
                  <nav className="flex flex-col gap-6">
                    {menuItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleScrollToSection(e, item.id)}
                        className="text-xl font-bold uppercase tracking-widest text-white/50 hover:text-yellow-400 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-auto mb-10 flex gap-4 text-sm font-bold tracking-widest">
                    <button onClick={() => handleChangeLanguage("vi")} className={currentLanguage === 'vi' ? 'text-yellow-400' : 'text-white/40'}>VN</button>
                    <button onClick={() => handleChangeLanguage("en")} className={currentLanguage === 'en' ? 'text-yellow-400' : 'text-white/40'}>EN</button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
