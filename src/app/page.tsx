'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
<<<<<<< HEAD
import Layout from '@/components/Layout'

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
    <Layout>
      <section className="bg-green-100 text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to Countryside Store 🛒</h1>
        <p className="text-lg text-green-700">Find the best deals on quality products.</p>
      </section>

      <section className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-xl shadow-sm p-4 hover:shadow-lg transition">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="mt-2 font-bold text-green-600">₦{product.price}</p>
                <button className="mt-2 bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800">
                  View Product
                </button>
=======
import Link from 'next/link'

type Product = {
  id: string
  name: string
  price: number
  image_url: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error.message)
      } else {
        setProducts(data as Product[])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Countryside Store</h1>
        <nav>
          <ul className="flex gap-6 text-gray-700">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/login">My Account</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-green-100 text-center py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Fresh & Quality Products</h2>
        <p className="text-lg text-gray-700 mb-6">
          Shop fresh and natural products directly from the countryside.
        </p>
        <Link href="/products">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Featured Products */}
      <main className="flex-grow p-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Products</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-lg p-4 transition"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-3 rounded"
                />
                <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                <p className="text-green-600 font-bold text-md mt-2">₦{product.price}</p>
                <Link href={`/product/${product.id}`}>
                  <button className="mt-3 bg-black text-white w-full py-2 rounded hover:bg-gray-800">
                    View Product
                  </button>
                </Link>
>>>>>>> 136e59c (✅ Restore project structure and fix lucide-react module issue)
              </div>
            ))}
          </div>
        )}
<<<<<<< HEAD
      </section>
    </Layout>
=======
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Countryside Store. All rights reserved.
      </footer>
    </div>
>>>>>>> 136e59c (✅ Restore project structure and fix lucide-react module issue)
  )
}
