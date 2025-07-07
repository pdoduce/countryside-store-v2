'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Layout components
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setMessage('')

    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      return setMessage('⚠️ All fields are required.')
    }

    if (isLogin) {
      // 🔐 Handle login
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return setMessage('❌ Login failed: ' + error.message)

      setMessage('✅ Login successful!')
      router.push('/')
    } else {
      // 🆕 Handle registration with metadata
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) return setMessage('❌ Signup failed: ' + error.message)

      setMessage('✅ Signup successful! Please check your email to confirm your account.')
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
    }
  }

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-md mx-auto mt-10 bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border rounded mb-4"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border rounded mb-4"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="text-green-700 font-semibold"
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </main>

      <Footer />
    </>
  )
}
