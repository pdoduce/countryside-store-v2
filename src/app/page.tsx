'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
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
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
