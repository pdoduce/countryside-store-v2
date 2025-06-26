'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-700">Countryside Store 🛍️</Link>
        <nav className="space-x-4 text-sm">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <Link href="/shop" className="hover:text-green-600">Shop</Link>
          <Link href="/categories" className="hover:text-green-600">Categories</Link>
          <Link href="/cart" className="hover:text-green-600">Cart</Link>
        </nav>
      </div>
    </header>
  )
}
