import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, roomName, date, time, ticketCount, totalPrice } = await req.json()

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#7f1d1d;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fcd34d;font-size:22px;font-weight:900;letter-spacing:1px;">DẤU CHÂN VIỆT</h1>
            <p style="margin:6px 0 0;color:#fef3c7;font-size:13px;">Monopoly Experience Hub</p>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:28px 32px 8px;text-align:center;">
            <h2 style="margin:0;color:#1a1a1a;font-size:20px;font-weight:800;">CẢM ƠN BẠN ĐÃ ĐẶT PHÒNG!</h2>
            <p style="margin:8px 0 0;color:#666;font-size:13px;">Chúng tôi đã nhận được yêu cầu đặt phòng của bạn.</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:16px 32px 0;"><hr style="border:none;border-top:1px solid #f0f0f0;" /></td></tr>

        <!-- Booking details -->
        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('Họ và tên', name)}
              ${row('Số điện thoại', phone)}
              ${row('Email', email)}
              ${row('Chủ đề', roomName)}
              ${row('Thời gian', `${date} · ${time}`)}
              ${row('Số lượng', `${ticketCount} người`)}
              ${rowHighlight('Tổng tiền', totalPrice)}
            </table>
          </td>
        </tr>

        <!-- Address -->
        <tr>
          <td style="padding:0 32px 28px;">
            <div style="background:#fef9f0;border-left:3px solid #991b1b;border-radius:0 8px 8px 0;padding:14px 16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:1px;">Cơ sở</p>
              <p style="margin:0;font-size:13px;color:#444;line-height:1.6;">Lô 16-B1.2, Khu số 4 – KĐT Nam Cầu Tiên Sơn, Anh Thơ, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng</p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#999;font-size:12px;line-height:1.8;">
              Nếu có thắc mắc, vui lòng liên hệ hotline hoặc nhắn tin qua Facebook &amp; TikTok.<br/>
              © 2026 Dấu Chân Việt. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

    await transporter.sendMail({
      from: `"Dấu Chân Việt" <hyperrhy1412@gmail.com>`,
      to: email,
      subject: `[Dấu Chân Việt] Xác nhận đặt phòng – ${roomName}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-booking-email]', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f5f5f5;width:40%;">
        <span style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f5f5f5;">
        <span style="font-size:14px;color:#222;font-weight:600;">${value}</span>
      </td>
    </tr>`
}

function rowHighlight(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 0 0;width:40%;">
        <span style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
      </td>
      <td style="padding:12px 0 0;">
        <span style="font-size:18px;color:#991b1b;font-weight:900;">${value}</span>
      </td>
    </tr>`
}
