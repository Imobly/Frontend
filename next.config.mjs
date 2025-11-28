/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build configuration
  output: 'standalone', // Required for Render deployment
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  
  // API Rewrites - only in development
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
    ]
  },
  
  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig