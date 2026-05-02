import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = await clientPromise
    const col = client.db('main').collection('vouchers')
    const voucher = await col.findOne({ code: 'TOP100EARLY', isActive: true })

    if (!voucher || voucher.usedQuantity >= voucher.maxQuantity) {
      return NextResponse.json({ available: false })
    }

    return NextResponse.json({
      available: true,
      code: voucher.code,
      discountPercent: voucher.discountPercent,
      remaining: voucher.maxQuantity - voucher.usedQuantity,
    })
  } catch {
    return NextResponse.json({ available: false })
  }
}

export async function POST() {
  try {
    const client = await clientPromise
    const col = client.db('main').collection('vouchers')

    const result = await col.findOneAndUpdate(
      {
        code: 'TOP100EARLY',
        isActive: true,
        $expr: { $lt: ['$usedQuantity', '$maxQuantity'] },
      },
      { $inc: { usedQuantity: 1 } },
      { returnDocument: 'after' },
    )

    if (!result) {
      return NextResponse.json({ success: false }, { status: 410 })
    }

    return NextResponse.json({
      success: true,
      code: result.code,
      discountPercent: result.discountPercent,
    })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
