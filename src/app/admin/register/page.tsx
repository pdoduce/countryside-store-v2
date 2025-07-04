'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { firstname, lastname, email, password } = formData

    if (!firstname || !lastname || !email || !password) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    try {
      // Step 1: Check if email exists in the `admin` table
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .single()

      if (adminError || !adminRecord) {
        throw new Error('This email is not authorized for admin registration.')
      }

      // Step 2: Sign up via Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstname,
            last_name: lastname,
            role: 'admin'
          }
        }
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      // Step 3: Insert into admin_users table
      const { error: userInsertError } = await supabase.from('admin_users').insert({
        firstname,
        lastname,
        email,
        created_at: new Date().toISOString()
      })

      if (userInsertError) {
        throw new Error('Failed to create admin profile.')
      }

      setSuccess('✅ Registration successful! Check your email to confirm.')
    } catch (err) {
      setError(`❌ ${err instanceof Error ? err.message : 'Registration failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Admin Registration</h2>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Register'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md">
            {success}
          </div>
        )}
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/admin" className="text-green-600 hover:text-green-700 font-medium">
          Login here
        </Link>
      </div>
    </div>
  )
}