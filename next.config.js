/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // For your Supabase storage
      {
        protocol: 'https',
        hostname: 'ulhtbciaoutwqsckrtir.supabase.co',
        pathname: '/storage/v1/object/public/products/**',
      },
      // For other common image hosting services (optional)
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Wildcard for all Supabase instances
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // If using AWS S3
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com', // For Google user content
      },
    ],
    // Optional: Configure image quality, formats, and device sizes
    formats: ['image/webp'],
    minimumCacheTTL: 86400, // Cache images for 1 day
  },
};

module.exports = nextConfig;