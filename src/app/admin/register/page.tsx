'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminRegisterPage() {
  const router = useRouter()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async () => {
    setError('')
    setSuccess('')

    if (!firstname || !lastname || !email || !password) {
      setError('All fields are required.')
      return
    }

    // Step 1: Check if email exists in the `admin` table
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .single()

    if (!adminRecord || adminError) {
      setError('❌ This email is not authorized for admin registration.')
      return
    }

    // Step 2: Sign up via Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      setError('❌ ' + signUpError.message)
      return
    }

    // Step 3: Insert into admin_users table
    const { error: userInsertError } = await supabase.from('admin_users').insert([
      {
        firstname,
        lastname,
        email,
        created_at: new Date().toISOString()
      }
    ])

    if (userInsertError) {
      setError('❌ Failed to create admin profile.')
    } else {
      setSuccess('✅ Registration successful! Check your email to confirm.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Admin Registration</h2>

      <input
        type="text"
        placeholder="Firstname"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="text"
        placeholder="Lastname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && <p className="mt-4 text-green-600">{success}</p>}
    </div>
  )
}
