'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-10">

      {/* Widget Section */}
      <section className="bg-green-100 py-12 px-4 md:px-10">
        
      </section>

      {/* Copyright Footer */}
      <div className="bg-black text-white text-center text-base md:text-lg py-4">
        &copy; {new Date().getFullYear()} Countryside Store. All rights reserved.
      </div>
    </footer>
  )
}
