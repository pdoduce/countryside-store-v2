// src/lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type Database } from '@/types/supabase' // Optional, use if you're using Supabase-generated types

export const createSupabaseServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
