'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
      setSearchVisible(false)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://ulhtbciaoutwqsckrtir.supabase.co/storage/v1/object/public/images//reallogoContr.png"
            alt="Countryside Logo"
            className="h-8 w-auto"
          />
          <span className="text-2xl font-bold text-green-700 hidden sm:inline">Countryside</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm text-gray-700">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <Link href="/shop" className="hover:text-green-600">Shop</Link>
          <Link href="/categories" className="hover:text-green-600">Categories</Link>
          <Link href="/cart" className="hover:text-green-600">Cart</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-gray-700">
          <button
            className="md:hidden"
            onClick={() => setSearchVisible(!searchVisible)}
            aria-label="Toggle Search"
          >
            {searchVisible ? (
              <X className="w-5 h-5 text-red-500" />
            ) : (
              <Search className="w-5 h-5 cursor-pointer hover:text-green-700" />
            )}
          </button>

          <Search
            className="hidden md:block w-5 h-5 cursor-pointer hover:text-green-700"
            onClick={() => setSearchVisible(!searchVisible)}
          />
          <User className="w-5 h-5 cursor-pointer hover:text-green-700" />
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-green-700" />

          {/* Hamburger Menu */}
          <button
            className="md:hidden ml-2 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6 hover:text-green-700" />
          </button>
        </div>
      </div>

      {/* Search Input (Mobile + Desktop) */}
      {searchVisible && (
        <div className="bg-green-100 px-4 py-2 border-t md:border-none">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 p-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t px-4 py-3 space-y-2 text-sm text-gray-700">
          <Link href="/" className="block hover:text-green-600">Home</Link>
          <Link href="/shop" className="block hover:text-green-600">Shop</Link>
          <Link href="/categories" className="block hover:text-green-600">Categories</Link>
          <Link href="/cart" className="block hover:text-green-600">Cart</Link>
        </div>
      )}
    </header>
  )
}
