// src/app/admin/orders/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total: number
  created_at: string
  payment_status: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setOrders(data)
      setLoading(false)
    }
    fetchOrders()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Admin - Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.customer_name}</td>
                <td className="p-2 border">₦{order.total.toLocaleString()}</td>
                <td className="p-2 border capitalize">{order.payment_status}</td>
                <td className="p-2 border">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    View
                  </Link>
                  {/* Optional: Delete button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
