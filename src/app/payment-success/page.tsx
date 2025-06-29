'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
//import { supabase } from '@/lib/supabase'
//import { toast } from 'sonner'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const txRef = searchParams?.get('tx_ref')
  const transactionId = searchParams?.get('transaction_id')
  const [status, setStatus] = useState('Verifying...')

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!transactionId || !txRef) {
        setStatus('Invalid transaction data')
        return
      }

      try {
        const res = await fetch(`/api/flutterwave-verify?transaction_id=${transactionId}`)
        const data = await res.json()

        if (data.status === 'success') {
          setStatus('Payment Verified Successfully 🎉')
        } else {
          setStatus('Payment verification failed')
        }
      } catch (err) {
        console.error(err)
        setStatus('Error verifying payment')
      }
    }

    verifyTransaction()
  }, [transactionId, txRef])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Status</h1>
        <p className="text-gray-700">{status}</p>
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
