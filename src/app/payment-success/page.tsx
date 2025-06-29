'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'pending'|'success'|'failed'>('pending')
  const [message, setMessage] = useState('Verifying payment...')

  useEffect(() => {
    async function verifyTransaction() {
      const txRef = searchParams?.get('tx_ref')
      const transactionId = searchParams?.get('transaction_id')
      if (!txRef || !transactionId) {
        setStatus('failed')
        setMessage('Missing transaction reference.')
        return
      }

      try {
        const res = await fetch('/api/flutterwave-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref: txRef, transaction_id: transactionId }),
        })
        const json = await res.json()
        if (json.status === 'success') {
          setStatus('success')
          setMessage('Your payment was successful! Thank you for your order.')
        } else {
          setStatus('failed')
          setMessage('Payment verification failed.')
        }
      } catch {
        setStatus('failed')
        setMessage('An error occurred during verification.')
      }
    }

    verifyTransaction()
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">
          {status === 'pending' && 'Verifying Payment...'}
          {status === 'success' && 'Payment Successful 🎉'}
          {status === 'failed' && 'Payment Failed ❌'}
        </h1>
        <p className="text-center text-gray-700">{message}</p>
      </main>
      <Footer />
    </div>
  )
}
