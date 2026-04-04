"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedText } from "@/components/ui/animated-text"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const SECTION_IDS = ['hero', 'rooms', 'instructions', 'pricing', 'reviews', 'contact']

export default function HomeHeader() {
  const { t, i18n } = useTranslation()
  const pathname = usePathname()
  const isHomePage = pathname === '/home' || pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleScrollToSection = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      if (isHomePage) {
        e.preventDefault()
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      setIsMobileMenuOpen(false)
    },
    [isHomePage]
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
      className={`fixed top-0 w-full z-50 h-20 flex items-center border-b backdrop-blur-xl transition-colors duration-300 ${
        isScrolled
          ? 'bg-black/90 border-white/10'
          : 'bg-transparent border-white/10'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6 h-full">
        <nav className="flex items-center h-full">

          {/* LOGO */}
          <Link href="/home" className="relative flex items-center shrink-0 h-12 w-auto">
            <Image
              src="/images/header/Logo.png"
              alt="Logo"
              width={160}
              height={60}
              priority
              className="w-auto h-full object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* DESKTOP MENU */}
          <NavigationMenu viewport={false} className="hidden md:flex ml-10 xl:ml-16 h-full items-center">
            <NavigationMenuList className="gap-8">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <Link
                    href={`/home#${item.id}`}
                    onClick={(e) => handleScrollToSection(e, item.id)}
                    className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${
                      activeSection === item.id
                        ? 'text-yellow-400'
                        : 'text-white/70'
                    }`}
                  >
                    <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-${item.id}`}>
                      {item.label}
                    </AnimatedText>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-4">
            {/* Đặt Vé CTA */}
            <Link
              href="/booking"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#fcd34d] text-[#7f1d1d] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#fbbf24] transition-colors shadow-md"
            >
              Đặt Vé
            </Link>

            <div className="hidden md:flex items-center gap-1 text-xs font-bold tracking-wider">
              <button
                onClick={() => handleChangeLanguage("vi")}
                className={`px-2 py-1 transition-colors duration-300 ${currentLanguage === "vi" ? "text-yellow-400" : "text-white/40 hover:text-white"}`}
              >
                VN
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => handleChangeLanguage("en")}
                className={`px-2 py-1 transition-colors duration-300 ${currentLanguage === "en" ? "text-yellow-400" : "text-white/40 hover:text-white"}`}
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
                      <Link
                        key={item.id}
                        href={`/home#${item.id}`}
                        onClick={(e) => handleScrollToSection(e, item.id)}
                        className={`text-xl font-bold uppercase tracking-widest transition-colors ${
                          activeSection === item.id ? 'text-yellow-400' : 'text-white/50 hover:text-yellow-400'
                        }`}
                      >
                        <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-mobile-${item.id}`}>
                          {item.label}
                        </AnimatedText>
                      </Link>
                    ))}
                  </nav>
                  <Link
                    href="/booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center bg-[#fcd34d] text-[#7f1d1d] text-base font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#fbbf24] transition-colors mt-4"
                  >
                    Đặt Vé Ngay
                  </Link>

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
