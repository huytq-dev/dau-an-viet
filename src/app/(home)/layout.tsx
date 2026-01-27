import React from "react"
import HomeHeader from "@/features/home/components/layout/home-header"
import HomeFooter from "@/features/home/components/layout/home-footer"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <HomeHeader />
      
      {/* Main Content - với padding top để tránh bị che bởi fixed header */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <HomeFooter />
    </div>
  )
}
