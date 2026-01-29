export default function HomeFooter() {
  return (
    <footer className="bg-[#0f0303] border-t border-white/5 py-12">
      <div className="container mx-auto px-4">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand Info */}
          <div className="text-left space-y-2">
            <p className="text-yellow-600 font-black text-xl tracking-[0.2em] uppercase">
              Dấu Chân Việt
            </p>
            <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
             Không gian giải trí trải nghiệm Cờ Tỷ
              Phú thực, kết hợp thử thách tương tác và văn hoa Việt
              Nam.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8">
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-yellow-500 transition-colors"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-yellow-500 transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-yellow-500 transition-colors"
            >
              Tiktok
            </a>
          </div>
        </div>

        {/* Copyright Divider */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20 font-medium">
            © 2026 Escape Room Danang. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Chính sách bảo mật</a>
          </div>
        </div>

      </div>
    </footer>
  )
}