'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  total: number
  created_at: string
  payment_status: string
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false })

      if (error) {
        setError('❌ Failed to fetch orders.')
      } else {
        setOrders(data || [])
      }

      setLoading(false)
    }

    fetchOrders()
  }, [router])

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">🧾 My Orders</h2>

        {loading ? (
          <div className="text-center text-gray-600 text-lg py-8">Loading your orders...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg py-8">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-8">
            You haven’t placed any orders yet.
            <br />
            <Link href="/shop" className="text-green-700 font-semibold hover:underline mt-4 inline-block">
              Start Shopping 🛒
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-green-100 text-gray-700 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left border">Date</th>
                  <th className="px-6 py-3 text-left border">Total</th>
                  <th className="px-6 py-3 text-left border">Status</th>
                  <th className="px-6 py-3 text-left border">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-green-50 transition">
                    <td className="px-6 py-4 border">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border font-medium text-green-800">
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border capitalize">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-green-700 font-medium hover:underline"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
