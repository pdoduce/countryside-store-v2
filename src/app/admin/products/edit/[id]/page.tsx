'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

export default function EditProductPage() {
  const params = useParams()
const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setMessage('❌ Error loading product')
        setLoading(false)
        return
      }

      if (data) {
        setName(data.name)
        setDescription(data.description || '')
        setPrice(data.price.toString())
        setCategory(data.category || '')
        setImageUrl(data.image_url || '')
      }

      setLoading(false)
    }

    fetchProduct()
  }, [id])

  const handleUpdate = async () => {
    setMessage('')

    if (!name || !price || !category) {
      setMessage('❌ Name, Price, and Category are required.')
      return
    }

    const { error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
      })
      .eq('id', id)

    if (error) {
      setMessage('❌ Failed to update product.')
      return
    }

    setMessage('✅ Product updated successfully.')
    router.push('/admin/products')
  }

  return (
    <>
      <Header />
      <Banner />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-green-700 mb-6">✏️ Edit Product</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="bg-white shadow p-6 rounded-md space-y-4 border">
            <input
              type="text"
              placeholder="Product Name"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="text"
              placeholder="Category"
              className="w-full border p-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="text"
              placeholder="Image URL"
              className="w-full border p-2 rounded"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Update Product
            </button>

            {message && (
              <p className={`mt-2 text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
