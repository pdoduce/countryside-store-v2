'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'

type Product = {
  id: string
  name: string
  price: number
  image_url: string
  category?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-100 text-center py-14 px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl font-bold text-green-800 mb-4">
          Fresh & Quality Products 🧺
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-6">
          Shop fresh and natural products directly from the countryside.
        </p>
        <Link href="/products">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Featured Products */}
      <main className="flex-grow p-4 md:p-6 bg-gray-50">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">🌟 Featured Products</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition flex flex-col"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-44 md:h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-md md:text-lg text-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-green-600 font-bold mt-1">₦{product.price}</p>
                <Link href={`/product/${product.id}`}>
                  <button className="mt-3 bg-black text-white w-full py-2 rounded hover:bg-gray-800">
                    View Product
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 px-4 text-center text-sm text-gray-600 mt-8">
        &copy; {new Date().getFullYear()} Countryside Store. All rights reserved.
      </footer>
    </div>
  )
}
