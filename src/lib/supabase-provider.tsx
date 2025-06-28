'use client'

import { createContext, useContext, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'

type SupabaseContextType = {
  supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType | null>(null)

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabase must be used inside SupabaseProvider')
  return context
}
