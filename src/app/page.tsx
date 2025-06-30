'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'
import { toast } from 'sonner'

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
  const [cartItems, setCartItems] = useState<string[]>([]) // stores added product ids

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (!error && data) {
        const shuffled = [...data].sort(() => 0.5 - Math.random())
        setProducts(shuffled)
      }
      setLoading(false)
    }

    fetchProducts()

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart.map((item: Product) => item.id))
  }, [])

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

  const formatPrice = (price: number) =>
    price.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    })

  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const alreadyInCart = existingCart.some((item: Product) => item.id === product.id)

    if (!alreadyInCart) {
      const updatedCart = [...existingCart, { ...product, quantity: 1 }]
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      setCartItems((prev) => [...prev, product.id])
      toast.success(`${toTitleCase(product.name)} added to cart!`)

      // update cart count in header
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: updatedCart.length }))
    }
  }

  const renderButton = (productId: string) => {
    const added = cartItems.includes(productId)
    return (
      <button
        onClick={() => {
          const product = products.find((p) => p.id === productId)
          if (product) handleAddToCart(product)
        }}
        disabled={added}
        className={`mt-3 py-2 rounded w-full font-semibold transition ${
          added
            ? 'bg-yellow-400 text-black cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {added ? 'Product Added ✅' : 'Add To Cart'}
      </button>
    )
  }

  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition flex flex-col items-center"
    >
      <div className="w-full">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-44 md:h-56 lg:h-64 object-contain rounded mb-2 bg-white cursor-pointer"
          />
          <h3 className="font-semibold text-md md:text-lg text-gray-800 text-center line-clamp-1 hover:underline">
            {toTitleCase(product.name)}
          </h3>
        </Link>
        <p className="text-green-600 font-bold mt-1 text-center">
          {formatPrice(product.price)}
        </p>
        {renderButton(product.id)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />

      <section className="bg-green-100 text-center py-14 px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl font-bold text-green-800 mb-4">
          Fresh & Quality Products 🧺
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-6">
          Shop fresh and natural products directly from the countryside.
        </p>
        <Link href="/shop">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md">
            Shop Now
          </button>
        </Link>
      </section>

      <main className="flex-grow p-4 md:p-6 bg-gray-50">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">🌟 Featured Products</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 12).map(renderProductCard)}
          </div>
        )}
      </main>

      <section className="bg-white py-12 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8">🛍️ Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Spices', icon: '🌶️' },
            { name: 'Food', icon: '🍛' },
            { name: 'Oils', icon: '🫒' },
            { name: 'Herbs', icon: '🌿' },
          ].map((category) => (
            <Link key={category.name} href={`/categories/${category.name.toLowerCase()}`}>
              <div className="bg-green-100 hover:bg-green-200 transition rounded-xl p-6 text-center shadow-md cursor-pointer">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-lg font-semibold text-green-800">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Explore {category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">🔥 Trending Products</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(12, 24).map(renderProductCard)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
