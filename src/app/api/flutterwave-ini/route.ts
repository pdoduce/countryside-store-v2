// app/api/flutterwave-init/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const flutterwaveSecretKey = process.env.FLW_SECRET_KEY

  const res = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${flutterwaveSecretKey}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (data.status === 'success') {
    return NextResponse.json({ link: data.data.link })
  } else {
    return NextResponse.json({ error: data.message || 'Payment failed' }, { status: 500 })
  }
}
