'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
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

const PRODUCTS_PER_PAGE = 20

export default function CategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (!error && data) setProducts(data)
      setLoading(false)
    }

    fetchCategoryProducts()
  }, [category])

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

  const formatPrice = (price: number) =>
    price.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    })

  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const updatedCart = [...existingCart, { ...product, quantity: 1 }]
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    toast.success(`${toTitleCase(product.name)} added to cart`)
  }

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Banner />

      <main className="flex-grow p-4 md:p-8 bg-gray-50">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-8 capitalize">
          {category} Products
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : currentProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found in this category.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition flex flex-col items-center"
                >
                  <Link href={`/product/${product.id}`} className="w-full">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-44 md:h-56 lg:h-64 object-contain rounded mb-2 bg-white"
                    />
                  </Link>

                  <Link href={`/product/${product.id}`} className="w-full text-center">
                    <h3 className="font-semibold text-md md:text-lg text-gray-800 capitalize hover:text-green-700">
                      {toTitleCase(product.name)}
                    </h3>
                  </Link>

                  <p className="text-green-600 font-bold mt-1 text-center">
                    {formatPrice(product.price)}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 w-full"
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center space-x-2 flex-wrap">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 ? 'bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-200 hover:bg-green-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
