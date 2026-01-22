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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function HomeHeader() {
  const { t, i18n } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language
  const scrollRafId = useRef<number | null>(null)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (scrollRafId.current !== null) return
      scrollRafId.current = window.requestAnimationFrame(() => {
        scrollRafId.current = null
        setIsScrolled(window.scrollY > 50)
      })
    }

    handleWindowScroll()
    window.addEventListener("scroll", handleWindowScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleWindowScroll)
      if (scrollRafId.current !== null) {
        window.cancelAnimationFrame(scrollRafId.current)
        scrollRafId.current = null
      }
    }
  }, [])

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

  const menuItems = useMemo(
    () => [
      { label: t("header.menu.home"), id: "hero" },
      { label: t("header.menu.booking"), id: "rooms" },
      { label: t("header.menu.instructions"), id: "instructions" },
      { label: t("header.menu.pricing"), id: "pricing" },
      { label: t("header.menu.reviews"), id: "reviews" },
      { label: t("header.menu.contact"), id: "contact" },
    ],
    [t]
  )

  return (
    <header className={`fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
      isScrolled ? "py-2" : "py-4"
    }`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className={`text-white font-bold text-xl relative flex items-center ${
            isScrolled ? "h-12 lg:h-14" : "h-16 lg:h-20"
          }`}>
            <Image 
              src="/images/header/Logo.png" 
              alt="Dấu Chân Việt Logo" 
              width={200}
              height={80}
              priority
              sizes="(max-width: 768px) 120px, 160px"
              className="w-auto h-full object-contain transition-all duration-300"
            />
          </div>

          {/* Desktop Menu */}
          <NavigationMenu viewport={false} className="hidden md:flex">
            <NavigationMenuList className="gap-6">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink asChild>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleScrollToSection(e, item.id)}
                      className="rounded-md px-2 py-1 text-white transition hover:text-yellow-300 font-semibold"
                    >
                      <AnimatedText 
                        animationType="fade" 
                        dependencyKey={`${currentLanguage}-${item.id}`}
                      >
                        {item.label}
                      </AnimatedText>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Language Buttons */}
          <div className="hidden md:flex gap-3">
            <Button
              onClick={() => handleChangeLanguage("vi")}
              variant="outline"
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentLanguage === "vi"
                  ? "bg-yellow-400 text-red-900 hover:bg-yellow-400/90 border-yellow-400"
                  : "border-white text-white hover:bg-white/10 hover:text-white"
              }`}
            >
              VI
            </Button>
            <Button
              onClick={() => handleChangeLanguage("en")}
              variant="outline"
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentLanguage === "en"
                  ? "bg-yellow-400 text-red-900 hover:bg-yellow-400/90 border-yellow-400"
                  : "border-white text-white hover:bg-white/10 hover:text-white"
              }`}
            >
              EN
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                aria-label="Toggle menu"
                className="md:hidden text-white hover:bg-white/10 hover:text-white h-10 w-10 p-0"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-red-900/95 text-white border-none">
              <SheetHeader className="border-b border-white/10">
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-4 py-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    asChild
                    variant="ghost"
                    className="justify-start px-2 py-3 text-white hover:bg-yellow-400/20 hover:text-white"
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleScrollToSection(e, item.id)}
                    >
                      <AnimatedText 
                        animationType="fade" 
                        dependencyKey={`${currentLanguage}-${item.id}`}
                      >
                        {item.label}
                      </AnimatedText>
                    </a>
                  </Button>
                ))}
              </nav>
              <div className="mt-auto flex gap-3 px-4 pb-4">
                <Button
                  onClick={() => handleChangeLanguage("vi")}
                  variant="outline"
                  className={`flex-1 rounded-lg font-semibold ${
                    currentLanguage === "vi"
                      ? "bg-yellow-400 text-red-900 hover:bg-yellow-400/90 border-yellow-400"
                      : "border-white text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  VI
                </Button>
                <Button
                  onClick={() => handleChangeLanguage("en")}
                  variant="outline"
                  className={`flex-1 rounded-lg font-semibold ${
                    currentLanguage === "en"
                      ? "bg-yellow-400 text-red-900 hover:bg-yellow-400/90 border-yellow-400"
                      : "border-white text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  EN
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}
