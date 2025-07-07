'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import AdminHeader from '../resusables/admin_header'
import AdminBanner from '../resusables/admin_banner'
import AdminFooter from '../resusables/admin_footer'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
}

const PRODUCTS_PER_PAGE = 12

export default function AdminProductListPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading products...</div>}>
      <AdminProductListPage />
    </Suspense>
  )
}

function AdminProductListPage() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams?.get('q')?.toLowerCase() || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [authLoading, setAuthLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return router.push('/login')

      const { data: roleData } = await supabase
        .from('roles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (roleData?.role !== 'admin') return router.push('/')
      setAuthLoading(false)
    }

    checkAccess()
  }, [router])

  useEffect(() => {
    const fetchTotalCount = async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (count) {
        setTotalPages(Math.ceil(count / PRODUCTS_PER_PAGE))
      }
    }

    if (!authLoading) fetchTotalCount()
  }, [authLoading])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const from = (currentPage - 1) * PRODUCTS_PER_PAGE
      const to = from + PRODUCTS_PER_PAGE - 1

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        setError('Failed to fetch products')
        setLoading(false)
        return
      }

      let filteredData = data || []
      if (searchTerm) {
        filteredData = filteredData.filter((product) =>
          product.name.toLowerCase().includes(searchTerm)
        )
      }

      setProducts(filteredData)
      setLoading(false)
    }

    if (!authLoading) fetchProducts()
  }, [currentPage, authLoading, searchTerm])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (authLoading) return <div className="p-10 text-center text-gray-600">Checking access...</div>

  return (
    <>
      <AdminHeader />
      <AdminBanner />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/admin"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">📦 Admin Product Management</h1>
          <Link
            href="/admin/products/add"
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
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow"
            >
              {product.image_url && (
                <div className="relative w-full h-60 mb-3">
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
                  onClick={() =>
                    confirm('Are you sure you want to delete this product?') &&
                    handleDelete(product.id)
                  }
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-10 flex justify-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      <AdminFooter />
    </>
  )
}

async function handleDelete(productId: string) {
  const confirmed = confirm('Are you sure you want to delete this product?')
  if (!confirmed) return

  const { error } = await supabase.from('products').delete().eq('id', productId)
  if (error) {
    alert('❌ Failed to delete product.')
  } else {
    alert('✅ Product deleted successfully. Reloading...')
    location.reload()
  }
}
