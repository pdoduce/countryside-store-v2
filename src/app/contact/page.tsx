'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can integrate with Supabase, EmailJS, or any service here
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 rounded-xl shadow-md p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-700">Send Us a Message</h2>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
            >
              Send Message
            </button>

            {submitted && (
              <p className="text-green-600 text-sm pt-2">
                ✅ Message sent successfully! We’ll get back to you soon.
              </p>
            )}
          </form>

          {/* Contact Info */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Get in Touch</h2>

            <div className="flex items-start space-x-4">
              <Phone className="text-green-600 w-6 h-6" />
              <div>
                <p className="font-medium text-gray-800">Phone</p>
                <p className="text-sm text-gray-600">+234 802 768 6565</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="text-green-600 w-6 h-6" />
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p className="text-sm text-gray-600">info@countryside.ng</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="text-green-600 w-6 h-6" />
              <div>
                <p className="font-medium text-gray-800">Address</p>
                <p className="text-sm text-gray-600">26, Masha Road, Surulere, Lagos, Nigeria</p>
              </div>
            </div>

            {/* Optional Google Map */}
            <div className="pt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.7051142656044!2d3.379205!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf44a2b5bbd1d%3A0x76fd3ef86ef64ae2!2sLagos%20Island!5e0!3m2!1sen!2sng!4v1600000000000"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
