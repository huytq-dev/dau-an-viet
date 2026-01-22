'use client'

import { ReactNode, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n/init'

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lấy ngôn ngữ từ localStorage sau khi component mount
    const savedLanguage = localStorage.getItem('language') || 'vi'
    
    // Chỉ thay đổi ngôn ngữ nếu khác với ngôn ngữ hiện tại
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  // Render ngay lập tức với i18n để tránh mismatch
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
