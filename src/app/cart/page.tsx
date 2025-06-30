
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
      const parsed = JSON.parse(storedCart)
      const unique = parsed.filter(
        (item: CartItem, index: number, self: CartItem[]) =>
          index === self.findIndex((t) => t.id === item.id)
      )
      setCart(unique)
    }
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
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

  const clearCart = () => {
    localStorage.removeItem('cart')
    setCart([])
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: 0 }))
    router.push('/shop')
  }

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="max-w-2xl mx-auto p-8 text-center mt-20 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">🛒 Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>
          <Link href="/shop">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              🛍️ Continue Shopping
            </button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">🛒 Your Shopping Cart</h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-100 text-left text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-4 w-24"></th>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cart.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4 text-green-600 font-semibold">₦{item.price.toLocaleString()}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-green-500"
                    />
                  </td>
                  <td className="p-4 font-semibold text-gray-700">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Total: <span className="text-green-700">₦{total.toLocaleString()}</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition"
            >
              🗑️ Clear Cart
            </button>
            <Link
              href="/checkout"
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition"
            >
              ✅ Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
