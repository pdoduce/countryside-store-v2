'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Search,
  User,
  Menu,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface User {
  id: string
  email?: string
}

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
      setSearchVisible(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!error && user) {
        setUser(user)
      }
    }
    getUser()
  }, [])

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/admin/admin" className="flex items-center space-x-2">
          <Image
            src="https://ulhtbciaoutwqsckrtir.supabase.co/storage/v1/object/public/images//reallogoContr.png"
            alt="Countryside Admin Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="text-xl font-bold text-green-700 hidden sm:inline">Admin Panel</span>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 text-gray-700 relative">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden"
            onClick={() => setSearchVisible(!searchVisible)}
            aria-label={searchVisible ? 'Close search' : 'Open search'}
          >
            {searchVisible ? (
              <X className="w-5 h-5 text-red-500" />
            ) : (
              <Search className="w-5 h-5 hover:text-green-700" />
            )}
          </button>

          {/* Desktop Search */}
          <Search
            className="hidden md:block w-5 h-5 cursor-pointer hover:text-green-700"
            onClick={() => setSearchVisible(!searchVisible)}
            aria-label="Search"
          />

          {/* Authenticated User */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="cursor-pointer"
                aria-label="Admin profile menu"
                aria-expanded={showProfileMenu}
              >
                🧑‍💼
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50">
                  <Link href="/admin/admin" className="block px-4 py-2 hover:bg-green-100">🏠 Dashboard</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-green-100"
                  >
                    🔐 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/admin" aria-label="Login">
              <User className="w-5 h-5 cursor-pointer hover:text-green-700" />
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mobile menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-6 h-6 hover:text-green-700" />
          </button>
        </div>
      </div>

      {/* Search Field */}
      {searchVisible && (
        <div className="bg-green-100 px-4 py-2 border-t">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for product name..."
              className="flex-1 p-2 rounded-l border border-gray-300 focus:ring-2 focus:ring-green-500"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
              aria-label="Submit search"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu (if needed) */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t px-4 py-3 space-y-2 text-sm text-gray-700">
          <Link href="/admin/admin" className="block hover:text-green-600">Dashboard</Link>
          <Link href="/admin/products" className="block hover:text-green-600">Products</Link>
          <Link href="/admin/users" className="block hover:text-green-600">Users</Link>
          <Link href="/admin/orders" className="block hover:text-green-600">Orders</Link>
        </div>
      )}
    </header>
  )
}
