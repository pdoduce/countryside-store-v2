'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'success' | 'failed' | 'pending'>('pending')

  useEffect(() => {
    const verifyTransaction = async () => {
      const txRef = searchParams?.get('tx_ref')
      const transactionId = searchParams?.get('transaction_id')

      if (!txRef || !transactionId) {
        setStatus('failed')
        return
      }

      try {
        const res = await fetch('/api/flutterwave-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref: txRef, transaction_id: transactionId }),
        })
        const { status: flwStatus } = await res.json()
        setStatus(flwStatus === 'successful' ? 'success' : 'failed')
      } catch {
        setStatus('failed')
      }
    }

    verifyTransaction()
  }, [searchParams])

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      {status === 'pending' && <p className="text-gray-700">Verifying payment, please wait…</p>}
      {status === 'success' && (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-800 mb-6">Thank you for your order. Your payment has been confirmed.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </>
      )}
      {status === 'failed' && (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="text-gray-800 mb-6">
            We could not verify your payment. Please try again or contact support.
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  )
}
