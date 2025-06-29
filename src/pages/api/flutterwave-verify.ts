import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { transaction_id } = req.query

  if (!transaction_id) {
    return res.status(400).json({ error: 'Missing transaction_id' })
  }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (result.status === 'success') {
      return res.status(200).json({
        status: 'success',
        tx_ref: result.data.tx_ref,
        meta: result.data.meta, // includes order_id if you passed it in checkout
      })
    }

    return res.status(200).json({ status: 'error', message: result.message })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
