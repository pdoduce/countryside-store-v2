import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Generate signature
  const signature = crypto
    .createHmac('sha256', FLW_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest('hex')

  const res = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      'verif-hash': signature,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  // if (data.status !== 'success') throw new Error('Flutterwave init failed')

  return NextResponse.json({ link: data.data.link })
}
