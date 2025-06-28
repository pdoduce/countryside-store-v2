import path from 'path'
import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Add image domain for Supabase
  images: {
    domains: ['ulhtbciaoutwqsckrtir.supabase.co'],
  },

  webpack: (config: Configuration) => {
    config.resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        '@': path.resolve(__dirname, 'src'),
      },
    }
    return config
  },
}

export default nextConfig
