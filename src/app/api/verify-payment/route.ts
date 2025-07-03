// src/app/api/verify-payment/route.ts

import { NextResponse } from 'next/server'
import { createSupabaseServerClient  } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { tx_ref } = await req.json()
  const supabase = createSupabaseServerClient ()

  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!
    const verifyUrl = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`

    const res = await fetch(verifyUrl, {
      method: 'GET', // ✅ THIS IS THE MAIN FIX: Set method to GET
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Flutterwave verification failed:', errorText)
      return NextResponse.json({ success: false, message: errorText }, { status: 400 })
    }

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
      return NextResponse.json({ success: false, message: 'Payment not successful' }, { status: 400 })
    }
  } catch (err) {
    console.error('Payment verification failed:', err)
    return NextResponse.json({ success: false, message: 'Unexpected server error' }, { status: 500 })
  }
}
