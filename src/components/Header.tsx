'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-green-700">
          Countryside 🛍️
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm text-gray-700">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <Link href="/products" className="hover:text-green-600">Shop</Link>
          <Link href="/categories" className="hover:text-green-600">Categories</Link>
          <Link href="/cart" className="hover:text-green-600">Cart</Link>
        </nav>

        {/* Icons */}
        <div className="flex space-x-4 text-gray-700">
          <Search className="w-5 h-5 cursor-pointer hover:text-green-600" />
          <User className="w-5 h-5 cursor-pointer hover:text-green-600" />
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-green-600" />
        </div>
      </div>
    </header>
  )
}
