'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  total: number
  created_at: string
  payment_status: string
  items?: OrderItem[]
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = Array.isArray(params?.orderId) ? params.orderId[0] : params?.orderId
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      setError('Invalid Order ID.')
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      setLoading(true)

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) {
        setError('❌ Failed to fetch order.')
        setLoading(false)
        return
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (itemsError) {
        setError('❌ Failed to fetch order items.')
        setLoading(false)
        return
      }

      setOrder({ ...orderData, items: itemsData || [] })
      setLoading(false)
    }

    fetchOrderDetails()
  }, [orderId])

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">🧾 Order Details</h2>

        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading order details...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">{error}</div>
        ) : !order ? (
          <div className="text-center text-gray-600 text-lg">Order not found.</div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="bg-white border shadow-md rounded-lg p-6 mb-6 space-y-3">
              <p><strong>🆔 Order ID:</strong> {order.id}</p>
              <p><strong>👤 Customer:</strong> {order.customer_name} ({order.customer_email})</p>
              <p><strong>📞 Phone:</strong> {order.customer_phone}</p>
              <p><strong>🏠 Address:</strong> {order.address}</p>
              <p>
                <strong>💳 Status:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.payment_status}
                </span>
              </p>
              <p><strong>📅 Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p className="text-xl font-semibold text-green-800">
                <strong>💰 Total:</strong> ₦{Number(order.total).toLocaleString()}
              </p>
            </div>

            {/* Order Items */}
            <h3 className="text-xl font-semibold mb-3 text-gray-800">🧂 Items</h3>
            <div className="overflow-x-auto border rounded-lg shadow">
              <table className="w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 border">#</th>
                    <th className="px-4 py-3 border">Product</th>
                    <th className="px-4 py-3 border">Price</th>
                    <th className="px-4 py-3 border">Qty</th>
                    <th className="px-4 py-3 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={item.id} className="hover:bg-green-50 border-t">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">₦{item.price.toLocaleString()}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/dashboard/orders')}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                ← Back To My Orders
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  )
}
