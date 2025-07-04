'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

export default function AdminDashboardPage() {
  const router = useRouter()
  //const [user, setUser] = useState<any>(null)
  //const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      //setUser(user)

      // Optional: check role from "roles" table
      const { data: roleData } = await supabase
        .from('roles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (roleData?.role !== 'admin') {
        router.push('/')
        return
      }

      //setIsAdmin(true)
      setLoading(false)
    }

    checkAccess()
  }, [router])

  if (loading) return <div className="p-10 text-center text-gray-600">Loading...</div>

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-green-700 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white border rounded shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">🛒 Manage Orders</h3>
            <button
              onClick={() => router.push('/admin/orders')}
              className="text-green-600 hover:underline"
            >
              View Orders
            </button>
          </div>

          <div className="bg-white border rounded shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">📦 Manage Products</h3>
            <button
              onClick={() => router.push('/admin/products')}
              className="text-green-600 hover:underline"
            >
              View Products
            </button>
          </div>

          <div className="bg-white border rounded shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">👥 Manage Users</h3>
            <button
              onClick={() => router.push('/admin/users')}
              className="text-green-600 hover:underline"
            >
              View Users
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
