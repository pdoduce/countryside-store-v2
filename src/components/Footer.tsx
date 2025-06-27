'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-10">

      {/* Widget Section */}
      <section className="bg-green-100 py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-800">
          
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3">About Countryside</h3>
            <p className="text-sm">
              We bring you fresh, organic foods and spices directly from rural farms. Quality and tradition meet here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-green-800">Home</Link></li>
              <li><Link href="/products" className="hover:text-green-800">Shop</Link></li>
              <li><Link href="/categories" className="hover:text-green-800">Categories</Link></li>
              <li><Link href="/contact" className="hover:text-green-800">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-green-800">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-green-800">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-green-800">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-green-800">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-3">Join Our Newsletter</h3>
            <p className="text-sm mb-3">Stay updated with our latest offers and news.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md border border-gray-300 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Copyright Footer */}
      <div className="bg-black text-white text-center text-base md:text-lg py-4">
        &copy; {new Date().getFullYear()} Countryside Store. All rights reserved.
      </div>
    </footer>
  )
}
