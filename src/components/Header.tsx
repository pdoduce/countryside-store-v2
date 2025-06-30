'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Flame,
  Utensils,
  Droplet,
  Sprout,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const router = useRouter()

  const categories = [
    { name: 'spices', icon: <Flame className="w-4 h-4 mr-2 text-red-500" /> },
    { name: 'food', icon: <Utensils className="w-4 h-4 mr-2 text-yellow-600" /> },
    { name: 'oils', icon: <Droplet className="w-4 h-4 mr-2 text-blue-500" /> },
    { name: 'herbs', icon: <Sprout className="w-4 h-4 mr-2 text-green-600" /> },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
      setSearchVisible(false)
    }
  }

  useEffect(() => {
    // Set initial cart count
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)

    // Listen for custom 'cart-updated' events
    const handleCartUpdated = (e: any) => {
      setCartCount(e.detail)
    }

    window.addEventListener('cart-updated', handleCartUpdated)

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdated)
    }
  }, [])

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://ulhtbciaoutwqsckrtir.supabase.co/storage/v1/object/public/images//reallogoContr.png"
            alt="Countryside Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-2xl font-bold text-green-700 hidden sm:inline">Countryside</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm text-gray-700 relative items-center">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <Link href="/shop" className="hover:text-green-600">Shop</Link>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
              className="flex items-center space-x-1 cursor-pointer hover:text-green-600 focus:outline-none"
            >
              <span>Categories</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-md z-20 py-2 w-44">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/categories/${cat.name}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 capitalize"
                    onClick={() => setShowCategoryDropdown(false)}
                  >
                    {cat.icon}
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/contact" className="hover:text-green-600">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-gray-700 relative">
          <button
            className="md:hidden"
            onClick={() => setSearchVisible(!searchVisible)}
            aria-label="Toggle Search"
          >
            {searchVisible ? (
              <X className="w-5 h-5 text-red-500" />
            ) : (
              <Search className="w-5 h-5 hover:text-green-700" />
            )}
          </button>

          <Search
            className="hidden md:block w-5 h-5 cursor-pointer hover:text-green-700"
            onClick={() => setSearchVisible(!searchVisible)}
          />
          <User className="w-5 h-5 cursor-pointer hover:text-green-700" />

          {/* Shopping Cart Icon with Count */}
          <div className="relative">
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-green-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

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

      {/* Search Input */}
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

          <details className="block">
            <summary className="cursor-pointer text-gray-700 hover:text-green-600">
              Categories
            </summary>
            <div className="pl-4 mt-2 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/categories/${cat.name}`}
                  className="flex items-center text-sm text-gray-700 hover:text-green-600 capitalize"
                >
                  {cat.icon}
                  {cat.name}
                </Link>
              ))}
            </div>
          </details>

          <Link href="/contact" className="block hover:text-green-600">Contact</Link>
          <Link href="/login" className="block hover:text-green-600">Account</Link>
        </div>
      )}
    </header>
  )
}
