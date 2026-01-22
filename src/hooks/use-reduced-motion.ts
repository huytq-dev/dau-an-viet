import { useEffect, useState } from "react";

/**
 * Hook phát hiện xem có nên giảm bớt chuyển động (animation) hay không.
 * Trả về `true` nếu:
 * 1. Người dùng bật setting "Reduce Motion" trong OS.
 * 2. HOẶC thiết bị là Mobile/Tablet (để tối ưu hiệu năng).
 */
export function useReducedMotion(): boolean {
  // Mặc định là false để khớp với Server-Side Rendering (tránh lỗi hydration)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Chỉ chạy ở phía Client (Browser)
    if (typeof window === "undefined") return;

    // 1. Kiểm tra Media Query của hệ điều hành
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 2. Hàm kiểm tra xem có phải thiết bị mobile/tablet không
    const checkIsMobile = () => {
      return (
        window.innerWidth < 768 || // Màn hình nhỏ
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || // User Agent của mobile
        ("ontouchstart" in window || navigator.maxTouchPoints > 0) // Có cảm ứng
      );
    };

    // Hàm cập nhật state tổng hợp
    const updateMotionPreference = () => {
      const isReduced = mediaQuery.matches;
      const isMobile = checkIsMobile();
      setShouldReduceMotion(isReduced || isMobile);
    };

    // Chạy kiểm tra lần đầu tiên
    updateMotionPreference();

    // Lắng nghe sự kiện thay đổi (ví dụ user bật setting reduced motion lúc đang lướt web)
    mediaQuery.addEventListener("change", updateMotionPreference);
    // Lắng nghe sự kiện resize (ví dụ xoay màn hình điện thoại)
    window.addEventListener("resize", updateMotionPreference);

    // Cleanup function: Gỡ bỏ sự kiện khi component unmount
    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("resize", updateMotionPreference);
    };
  }, []);

  return shouldReduceMotion;
}