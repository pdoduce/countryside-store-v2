// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  // Your other Next.js config options can go here
  typescript: {
    // Optional: Disable TypeScript errors during build too
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig