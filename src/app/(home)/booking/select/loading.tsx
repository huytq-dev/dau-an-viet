"use client"

import { useEffect, useState } from "react"

function getLoadingText(search: string): string {
  const params = new URLSearchParams(search)
  const room = params.get('room') ?? ''
  const date = params.get('date') ?? ''
  const time = params.get('time') ?? ''

  const roomNames: Record<string, string> = {
    'mien-dat-viet': 'Phòng Miền Đất Việt',
    'lang-viet-song': 'Phòng Làng Việt Sông',
    'lang-nghe': 'Phòng Làng Nghề',
  }
  const roomName = roomNames[room] ?? 'Phòng trải nghiệm'

  if (!date) return `Đang tìm vé cho ${roomName}...`

  const d = new Date(date)
  const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ]
  const dateStr = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`

  return `Đang tìm vé cho ${roomName} - ${dateStr}${time ? `, ${time}` : ''}`
}

export default function Loading() {
  const [text, setText] = useState('Đang tìm vé...')

  useEffect(() => {
    setText(getLoadingText(window.location.search))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg px-10 py-12 flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Donut spinner */}
        <div className="relative w-20 h-20">
          {/* Outer light ring */}
          <div className="absolute inset-0 rounded-full border-[7px] border-[#fef3c7]" />
          {/* Rotating arc */}
          <div
            className="absolute inset-0 rounded-full border-[7px] border-transparent animate-spin"
            style={{
              borderTopColor: '#7f1d1d',
              borderRightColor: '#991b1b',
              animationDuration: '0.9s',
              animationTimingFunction: 'linear',
            }}
          />
        </div>

        <p className="text-gray-500 text-sm text-center leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
