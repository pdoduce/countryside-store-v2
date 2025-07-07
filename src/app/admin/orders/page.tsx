'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

import AdminHeader from '../resusables/admin_header'
import AdminBanner from '../resusables/admin_banner'
import AdminFooter from '../resusables/admin_footer'

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
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: roleData } = await supabase
        .from('roles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (roleData?.role !== 'admin') {
        router.push('/')
        return
      }

      setAuthLoading(false)
    }

    checkAccess()
  }, [router])

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setOrders(data || [])
      setLoading(false)
    }

    if (!authLoading) {
      fetchOrders()
    }
  }, [authLoading])

  if (authLoading) return <div className="p-10 text-center text-gray-600">Checking access...</div>

  return (
    <>
      <AdminHeader />
      <AdminBanner />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ Back to Dashboard Button */}
        <div className="mb-6">
          <Link
            href="/admin/admin"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-green-700">Admin - Orders</h2>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <AdminFooter />
    </>
  )
}
