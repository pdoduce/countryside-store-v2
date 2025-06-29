import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const { tx_ref, transaction_id } = req.body

  // build the signature for verification
  const hash = crypto
    .createHmac('sha256', FLW_SECRET_KEY)
    .update(`${tx_ref}|${transaction_id}`)
    .digest('hex')

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'verif-hash': hash,
      },
    })
    const json = await response.json()
    return res.status(200).json(json)
  } catch {
    return res.status(500).json({ status: 'error', message: 'Verification failed' })
  }
}
