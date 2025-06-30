'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url: string
  category?: string
}

export default function ProductDetailPage() {
  const params = useParams() as { id: string }
  const id = params.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedStatus, setAddedStatus] = useState(false)
  const [related, setRelated] = useState<Product[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (!error && data) {
        setProduct(data)
        fetchRelatedProducts(data.category || '')
      }
      setLoading(false)
    }

    const fetchRelatedProducts = async (category: string) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', id)
        .limit(4)

      if (!error && data) setRelated(data)
    }

    fetchProduct()
  }, [id])

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

  const formatPrice = (price: number) =>
    price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 })

  const handleCartAction = () => {
    if (!product) return

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')

    const itemIndex = existingCart.findIndex((item: Product) => item.id === product.id)

    if (itemIndex !== -1) {
      // Update quantity
      existingCart[itemIndex].quantity += quantity
    } else {
      existingCart.push({ ...product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(existingCart))
    setAddedStatus(true)
    toast.success(`${toTitleCase(product.name)} added to cart`)
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: existingCart.length }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />

      <main className="flex-grow p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto mb-6">
          <Link
            href="/shop"
            className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200"
          >
            ← Back to Shop
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading product...</p>
        ) : !product ? (
          <p className="text-center text-red-500">Product not found.</p>
        ) : (
          <>
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative w-full h-72 md:h-[28rem]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain bg-white rounded"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {toTitleCase(product.name)}
                </h1>
                <p className="text-green-600 text-xl font-bold mb-4">
                  {formatPrice(product.price)}
                </p>

                {product.description && (
                  <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description}</p>
                )}

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label htmlFor="qty" className="block text-sm font-medium text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    id="qty"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Add/Update Button */}
                <button
                  onClick={handleCartAction}
                  className={`w-full md:w-1/2 px-6 py-3 rounded-full font-semibold transition ${
                    addedStatus
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {addedStatus ? 'Product Added ✅' : 'Update Cart 🛒'}
                </button>

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

            {/* ⭐ Reviews Placeholder */}
            <div className="max-w-5xl mx-auto mt-12 bg-white rounded-xl shadow p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">🌟 Reviews</h2>
              <p className="text-gray-500 italic">
                Product reviews coming soon. Customers will be able to rate and share experiences here.
              </p>
            </div>

            {/* 🔁 Related Products */}
            {related.length > 0 && (
              <div className="max-w-6xl mx-auto mt-16 px-4">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-800">
                  🔄 Related Products
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {related.map((item) => {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
                    const inCart = cart.some((ci: Product) => ci.id === item.id)

                    const handleAddRelated = () => {
                      if (inCart) return
                      const updatedCart = [...cart, { ...item, quantity: 1 }]
                      localStorage.setItem('cart', JSON.stringify(updatedCart))
                      toast.success(`${toTitleCase(item.name)} added to cart`)
                      window.dispatchEvent(
                        new CustomEvent('cart-updated', { detail: updatedCart.length })
                      )
                    }

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition flex flex-col items-center"
                      >
                        <Link href={`/product/${item.id}`} className="w-full block">
                          <div className="relative w-full h-44 md:h-56 lg:h-64 mb-2 bg-white rounded">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                        </Link>

                        <Link href={`/product/${item.id}`} className="w-full text-center">
                          <h3 className="font-semibold text-md md:text-lg text-gray-800 capitalize hover:text-green-700">
                            {toTitleCase(item.name)}
                          </h3>
                        </Link>

                        <p className="text-green-600 font-bold mt-1 text-center">
                          {formatPrice(item.price)}
                        </p>

                        <button
                          onClick={handleAddRelated}
                          disabled={inCart}
                          className={`mt-4 w-full py-2 rounded font-semibold transition ${
                            inCart
                              ? 'bg-yellow-400 text-black cursor-not-allowed'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          {inCart ? 'Product Added ✅' : 'Add To Cart'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
