'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

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
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('flutterwave')

  // Billing form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
  })

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handlePlaceOrder = async () => {
    const {
      firstName, lastName, country, address, city, state, phone, email
    } = form

    if (!firstName || !lastName || !country || !address || !city || !state || !phone || !email) {
      alert('Please fill in all required fields.')
      return
    }

    setLoading(true)

    const customer_name = `${firstName} ${lastName}`

    // Save order
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name,
          customer_email: email,
          customer_phone: phone,
          address: `${address}, ${city}, ${state}, ${country}`,
          items: cart,
          total,
        },
      ])
      .select()
      .single()

    if (error) {
      alert('Failed to place order. Try again.')
      setLoading(false)
      return
    }

    // Save order items
    const itemsPayload = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
    await supabase.from('order_items').insert(itemsPayload)

    if (paymentMethod === 'bank') {
      localStorage.removeItem('cart')
      router.push('/payment-bank') // You can create this page for bank details
    } else {
      // Flutterwave Checkout
      const tx_ref = `${Date.now()}-${order.id}`
      const redirect_url = `${window.location.origin}/payment-success`

      const payload = {
        tx_ref,
        amount: total,
        currency: 'NGN',
        redirect_url,
        customer: {
          email,
          phonenumber: phone,
          name: customer_name,
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
        localStorage.removeItem('cart')
        router.push(link)
      } else {
        alert('Payment failed to initialize.')
        setLoading(false)
      }
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              placeholder="First Name *"
              className="p-3 border rounded w-full"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              placeholder="Last Name *"
              className="p-3 border rounded w-full"
              required
            />
            <select
              name="country"
              value={form.country}
              onChange={handleInputChange}
              className="p-3 border rounded w-full"
              required
            >
              <option value="">Select Country *</option>
              {['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'USA', 'UK', 'Canada', 'Germany'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="House Number and Street Name *"
              className="p-3 border rounded w-full"
              required
            />
            <input
              name="city"
              value={form.city}
              onChange={handleInputChange}
              placeholder="Town/City *"
              className="p-3 border rounded w-full"
              required
            />
            <input
              name="state"
              value={form.state}
              onChange={handleInputChange}
              placeholder="State *"
              className="p-3 border rounded w-full"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Phone Number *"
              className="p-3 border rounded w-full"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email Address *"
              className="p-3 border rounded w-full"
              required
            />
          </div>
        </div>

        {/* Order Summary + Payment */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Order Summary</h2>

          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-2 text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-green-700">₦{total.toLocaleString()}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold mb-2 text-gray-700">Select Payment Method:</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Direct Bank Transfer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="flutterwave"
                  checked={paymentMethod === 'flutterwave'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="flex items-center">
                  Rave by Flutterwave
                  <Image
                    src="https://ulhtbciaoutwqsckrtir.supabase.co/storage/v1/object/public/images//flutterwaveLogo.png"
                    alt="Flutterwave"
                    width={150}
                    height={70}
                    className="ml-2"
                  />
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
          >
            {loading ? 'Placing Order...' : '🛍️ Place Order'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
