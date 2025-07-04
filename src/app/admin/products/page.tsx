'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
}

export default function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to fetch products')
        setLoading(false)
        return
      }

      setProducts(data || [])
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">📦 Admin Product Management</h1>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ＋ Add New Product
          </Link>
        </div>

        {loading && <p className="text-gray-600">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && products.length === 0 && (
          <p className="text-gray-600">No products found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
              {product.image_url && (
                <div className="relative w-full h-48 mb-3">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-green-800">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <p className="text-green-700 font-bold mt-2">₦{product.price.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">Category: {product.category}</p>
              <div className="mt-4 flex justify-between space-x-2">
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-1 text-center"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => confirm('Are you sure you want to delete this product?') && 
                    handleDelete(product.id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

async function handleDelete(productId: string) {
  // Implement your delete logic here
  console.log('Deleting product:', productId)
}