'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Step 1: Sign in the user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      setError('Invalid email or password.')
      return
    }

    // Step 2: Check if the email exists in the `admin` table
    const { data: adminCheck, error: adminError } = await supabase
      .from('admin')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (!adminCheck || adminError) {
      // Signed in successfully but not an admin
      setError('❌ You are not admin, be warned!')
      await supabase.auth.signOut() // Sign out non-admin user
      return
    }

    // ✅ Step 3: Valid admin, redirect
    router.push('/admin/admin')
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        
        <div className="mt-4 text-center">
          <Link 
            href="/admin/register" 
            className="text-green-600 hover:underline text-sm"
          >
            Register new admin account
          </Link>
        </div>
      </form>
    </div>
  )
}