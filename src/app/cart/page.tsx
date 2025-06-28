'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  image_url: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-green-600 underline">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow p-4 rounded"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={item.image_url}
                alt={item.name}
                width={60}
                height={60}
                className="rounded object-cover"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-500">₦{item.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Total: ₦{total.toLocaleString()}</h3>
        <Link
          href="/checkout"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
