'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

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

export default function AdminOrderDetailsPage() {
  const params = useParams()
  const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

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
        setError('Failed to fetch order.')
        setLoading(false)
        return
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (itemsError) {
        setError('Failed to fetch order items.')
        setLoading(false)
        return
      }

      setOrder({ ...orderData, items: itemsData || [] })
      setLoading(false)
    }

    fetchOrderDetails()
  }, [orderId])

  const markAsPaid = async () => {
    if (!orderId) return
    setUpdating(true)
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', orderId)

    if (!error && order) {
      setOrder({ ...order, payment_status: 'paid' })
    }

    setUpdating(false)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!order) return <div className="p-6 text-gray-600">Order not found.</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Admin – Order Details</h2>

      <div className="bg-white shadow rounded border p-4 mb-6">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer:</strong> {order.customer_name} ({order.customer_email})</p>
        <p><strong>Phone:</strong> {order.customer_phone}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className="capitalize">{order.payment_status}</span>{' '}
          {order.payment_status !== 'paid' && (
            <button
              onClick={markAsPaid}
              disabled={updating}
              className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              {updating ? 'Updating...' : 'Mark as Paid'}
            </button>
          )}
        </p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Total:</strong> ₦{Number(order.total).toLocaleString()}</p>
      </div>

      <h3 className="text-lg font-semibold mb-3">Order Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Qty</th>
              <th className="px-4 py-2 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2 border">{i + 1}</td>
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
    </div>
  )
}
