import './globals.css'
import type { Metadata } from 'next'
import { SupabaseProvider } from '@/lib/supabase-provider'

export const metadata: Metadata = {
  title: 'Countryside Store',
  description: 'Organic & Natural Products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
