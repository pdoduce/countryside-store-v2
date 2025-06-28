'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface CartItem {
  id: string
  name: string
  image_url: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  // const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!
  // const redirectUrl = `${window.location.origin}/payment-success`

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    if (!name || !email || !phone) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)

    // 1. Create order in Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          items: cart,
          total,
        },
      ])
      .select()
      .single()

    if (error) {
      alert('Order creation failed')
      setLoading(false)
      return
    }

    // 2. Insert order items
    const itemsPayload = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    await supabase.from('order_items').insert(itemsPayload)

    // 3. Redirect to Flutterwave
    const tx_ref = `${Date.now()}-${order.id}`

    const payload = {
      tx_ref,
      amount: total,
      currency: 'NGN',
      customer: {
        email,
        phonenumber: phone,
        name,
      },
      meta: {
        order_id: order.id,
      },
      customizations: {
        title: 'Countryside Store',
        logo: 'https://ulhtbciaoutwqsckrtir.supabase.co/storage/v1/object/public/images//reallogoContr.png',
      },
    }

    const response = await fetch('/api/flutterwave-init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const { link } = await response.json()

    if (link) {
      localStorage.removeItem('cart') // clear cart
      router.push(link)
    } else {
      alert('Payment redirect failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-3 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full p-3 border rounded"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Total: ₦{total.toLocaleString()}</h3>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay with Flutterwave'}
        </button>
      </div>
    </div>
  )
}
