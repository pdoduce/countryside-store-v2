import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { transaction_id } = body

  try {
    const secretKey = process.env.FLW_SECRET_KEY
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    // You can also update your Supabase order status here if needed

    return NextResponse.json({
      status: result.data.status,
      amount: result.data.amount,
      currency: result.data.currency,
      customer: result.data.customer,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
