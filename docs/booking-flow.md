# Booking Flow — Đầu Chân Việt

## Route Structure

```
/booking                        → Calendar chọn ngày
/booking/select?date&room&time  → Chọn đội / người chơi / loại vé
```

Both routes share `(home)` layout → có Header + Footer.

---

## Flow

```
1. /booking
   - Chọn số vé (1-10) + lọc khung giờ
   - Calendar tháng (April–May 2026 mock)
   - Click ngày có vé → mở TimeSlotPanel (Dialog)

2. TimeSlotPanel (Dialog overlay)
   - Scroll ngày ngang
   - 3 phòng × 6 khung giờ mỗi phòng
   - Click khung giờ → đóng dialog → navigate /booking/select

3. loading.tsx (~1.5s)
   - Spinner đỏ/vàng
   - Text: "Đang tìm vé cho [phòng] - [ngày], [giờ]"

4. /booking/select
   - Header: ← Chọn Đội & Loại Vé  ✕
   - LEFT: Grid 4 đội × 6 người chơi
     - Slot xám + ✕ = đã book (disabled)
     - Slot đỏ = còn trống → click mở TicketTypeModal
     - Slot xanh = đã thêm vào giỏ trong session này
   - RIGHT: Cart panel
     - Card thông tin phòng + ngày + giờ
     - Danh sách vé đã chọn (có nút Xoá)
     - Tổng tiền
     - Nút "Tiếp tục" (disabled khi giỏ trống)

5. TicketTypeModal (Dialog)
   - Hiển thị: Đội + Vị trí
   - 5 loại vé: VIP / Cao Cấp / Tiêu Chuẩn / Hỗ Trợ / Combo
   - Mỗi loại: tên + giá (base + phí) + mô tả + nút Chọn
   - Chọn → thêm vào cart, đóng modal
```

---

## File Map

```
src/
├── app/(home)/
│   ├── booking/
│   │   ├── page.tsx                    → import BookingPage
│   │   └── select/
│   │       ├── page.tsx                → async, delay 1.5s, import TeamSelectionPage
│   │       └── loading.tsx             → spinner (client, đọc window.location.search)
│   └── layout.tsx                      → BookingProvider + Header + Footer
│
└── features/booking/
    ├── booking-page.tsx                → state: ticketCount, timeFilter, selectedDate
    ├── data/
    │   ├── booking-data.ts             → CALENDAR_MAP, getTimeSlotsForDate, formatPrice
    │   └── team-data.ts                → getTeamsForSlot, TICKET_TYPES, ROOM_INFO
    └── components/
        ├── booking-calendar.tsx        → grid lịch tháng
        ├── time-slot-panel.tsx         → Dialog khung giờ, navigate on click
        ├── team-selection-page.tsx     → grid đội + cart panel (client)
        └── ticket-type-modal.tsx       → Dialog chọn loại vé
```

---

## Lịch & Giá thực tế (VND/người)

**2 phòng, 8 slot/ngày, mỗi slot 90 phút:**

| Slot | Miền Đất Việt | Làng Việt Sống |
|------|--------------|----------------|
| 1 | 09:00–10:30 | 09:10–10:40 |
| 2 | 10:45–12:15 | 10:55–12:25 |
| 3 | 12:30–14:00 | 12:40–14:10 |
| 4 | 14:15–15:45 | 14:25–15:55 |
| 5 | 16:00–17:30 | 16:10–17:40 |
| 6 | 17:45–19:15 | 17:55–19:25 |
| 7 | 19:30–21:00 | 19:40–21:10 |
| 8 | 21:15–22:45 | 21:25–22:55 |

**Giá (hàm `getSlotPrice(roomId, date, time)` trong booking-data.ts):**

| | Off-peak (T2–T6 trước 17:00) | Peak (T6 ≥17:00, T7, CN) |
|-|------------------------------|--------------------------|
| Miền Đất Việt | 199k | 229k |
| Làng Việt Sống | 219k | 249k |

**Phụ thu:** +20k/người sau 21:00 (Slot 8)

**Không còn chọn loại vé** — giá hiện ngay trên slot button, click là thêm vào giỏ.

---

## Màu sắc chính

- Background trang: `#7f1d1d` (đỏ đậm)
- Available slot / CTA: `#991b1b`
- Accent / Today highlight: `#fcd34d` (vàng)
- Checkout pages (select, modal): white/gray (light theme)
- Slot đã chọn: `green-600`
- Còn chỗ: `green-600` | Sắp hết: `orange-500` | Hết vé: `red-700`

---

## Chưa làm

- Bước checkout sau "Tiếp tục" (thanh toán)
- Auth (login trước khi đặt vé)
- Backend / API thật (hiện tại toàn mock data)
