'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url: string
  category?: string
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) setProduct(data)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  const formatPrice = (price: number) =>
    price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 })

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />

      <main className="flex-grow p-4 md:p-8 bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-500">Loading product...</p>
        ) : !product ? (
          <p className="text-center text-red-500">Product not found.</p>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-72 md:h-[28rem] object-contain bg-white rounded"
            />

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {toTitleCase(product.name)}
              </h1>
              <p className="text-green-600 text-xl font-bold mb-4">{formatPrice(product.price)}</p>

              {product.description && (
                <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description}</p>
              )}

              <Link href="/cart">
                <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full w-full md:w-1/2">
                  Add To Cart 🛒
                </button>
              </Link>

              {product.category && (
                <p className="mt-4 text-sm text-gray-500">
                  Category:{' '}
                  <Link
                    href={`/categories/${product.category.toLowerCase()}`}
                    className="text-green-600 hover:underline capitalize"
                  >
                    {product.category}
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
