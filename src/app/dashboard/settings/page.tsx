'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

interface User {
  id: string
  email?: string
}

export default function UserSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null) // Fixed: Replaced 'any' with User type
  const [phone, setPhone] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('phone, billing_address')
        .eq('id', user.id)
        .single()

      if (!profileError && profile) {
        setPhone(profile.phone || '')
        setBillingAddress(profile.billing_address || '')
      }

      setLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  const handleUpdate = async () => {
    setMessage('')
    if (!phone || !billingAddress) {
      return setMessage('❌ All fields are required.')
    }

    if (!user?.id) {
      return setMessage('❌ User not authenticated.')
    }

    const { error } = await supabase
      .from('profiles')
      .update({ phone, billing_address: billingAddress })
      .eq('id', user.id)

    if (error) {
      return setMessage('❌ Failed to update settings.')
    }

    setMessage('✅ Settings updated successfully.')
  }

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">⚙️ Account Settings</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading user info...</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 space-y-5 border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {message && (
              <p className={`text-sm text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => router.push('/dashboard/orders')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
              >
                ← Back to Orders
              </button>

              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}