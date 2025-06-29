'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')

  useEffect(() => {
    const verifyTransaction = async () => {
      const txRef = searchParams?.get('tx_ref')
      const transactionId = searchParams?.get('transaction_id')

      if (!txRef || !transactionId) {
        setStatus('failed')
        return
      }

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref: txRef, transaction_id: transactionId }),
        })

        const result = await res.json()

        if (result.status === 'success') {
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } catch (err) {
        setStatus('failed')
      }
    }

    verifyTransaction()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'verifying' && <p className="text-gray-500">🔄 Verifying your payment...</p>}

        {status === 'success' && (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-2">✅ Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order. We will process it shortly.</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-2">❌ Payment Failed!</h1>
            <p className="text-gray-600">We could not verify your transaction. Please contact support.</p>
          </>
        )}
      </div>
    </div>
  )
}
