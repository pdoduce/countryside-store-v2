'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

import AdminHeader from '../resusables/admin_header'
import AdminBanner from '../resusables/admin_banner'
import AdminFooter from '../resusables/admin_footer'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  billing_address: string | null
  created_at: string | null
  last_login: string | null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return router.push('/admin') // redirect to login

      const { data: roleData } = await supabase
        .from('roles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (roleData?.role !== 'admin') return router.push('/')
      setAuthLoading(false)
    }

    checkAccess()
  }, [router])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('admin_user_list')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error.message)
      } else {
        setUsers(data || [])
      }

      setLoading(false)
    }

    if (!authLoading) fetchUsers()
  }, [authLoading])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Do you really want to delete this user?')
    if (!confirmDelete) return

    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) return alert('Failed to delete user: ' + error.message)

    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  if (authLoading) return <div className="p-6 text-center">Checking admin access...</div>

  return (
    <>
      <AdminHeader />
      <AdminBanner />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">Admin – All Users</h2>
          <button
            onClick={() => router.push('/admin/admin')}
            className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 text-gray-700"
          >
            🔙 Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border text-sm">
              <thead className="bg-green-100 text-gray-800">
                <tr>
                  <th className="p-3 border">Full Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Billing Address</th>
                  <th className="p-3 border">Date Registered</th>
                  <th className="p-3 border">Last Login</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.phone || 'N/A'}</td>
                    <td className="p-3 border">{user.billing_address || 'N/A'}</td>
                    <td className="p-3 border">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </td>
                    <td className="p-3 border">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
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
