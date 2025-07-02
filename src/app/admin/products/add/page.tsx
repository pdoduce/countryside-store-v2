'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Footer from '@/components/Footer'

export default function AddProductPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!name || !price || !category) {
      return setMessage('❌ Name, price, and category are required.')
    }

    const { error } = await supabase.from('products').insert([
      {
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl,
        category,
        created_at: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      },
    ])

    if (error) {
      console.error(error)
      return setMessage('❌ Failed to add product: ' + error.message)
    }

    setMessage('✅ Product added successfully!')
    router.push('/admin/products')
  }

  return (
    <>
      <Header />
      <Banner />

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-8 rounded">
        <h2 className="text-2xl font-bold mb-6 text-green-700">➕ Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />
          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded"
          />
          <input
            type="number"
            placeholder="Price (₦)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-3 rounded"
          />
          <input
            type="text"
            placeholder="Category (e.g. spices, herbs)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Product
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-red-600">{message}</p>
          )}
        </form>
      </div>

      <Footer />
    </>
  )
}
