// ✅ src/app/logout/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        // ✅ Sign out of Supabase
        await supabase.auth.signOut()

        // ✅ Clear local cart or any other client-side session data
        localStorage.removeItem('cart')

        // ✅ Redirect to homepage
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    logout()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-xl font-medium text-green-700">
      Logging out...
    </div>
  )
}
