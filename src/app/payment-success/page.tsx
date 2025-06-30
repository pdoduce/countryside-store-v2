'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const txRef = searchParams?.get('tx_ref')
  const [status, setStatus] = useState('Verifying payment...')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txRef) {
        setStatus('Transaction reference not found.')
        return
      }

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref: txRef }),
        })

        const data = await res.json()

        if (res.ok && data.success) {
          setStatus('✅ Payment Verified Successfully! 🎉')
        } else {
          setStatus('❌ Payment verification failed. Please contact support.')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        setStatus('❌ Error verifying payment. Try again later.')
      }
    }

    verifyPayment()
  }, [txRef])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Status</h1>
        <p className="text-gray-800">{status}</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-gray-500">Loading...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
