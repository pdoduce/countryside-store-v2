// src/app/api/verify-payment/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { tx_ref } = await req.json()
  const supabase = createClient()

  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!
    const verifyUrl = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`

    const res = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await res.json()
    const paymentData = result.data

    if (paymentData?.status === 'successful') {
      const orderId = paymentData.meta?.order_id

      // ✅ Mark order as paid
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', orderId)

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false }, { status: 400 })
    }
  } catch (err) {
    console.error('Payment verification failed:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
