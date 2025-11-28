/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build configuration
  output: 'standalone', // Required for Docker deployment
  
  // Image optimization
  images: {
    unoptimized: true,
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
  
  // API Rewrites to handle CORS - only in development
  async rewrites() {
    // In production (Docker), let browser access backend directly
    // This avoids CORS issues by using absolute URLs
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    
    // In development, use proxy to avoid CORS
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
      {
        source: '/api/v1/auth/:path*',
        destination: 'http://localhost:8001/api/v1/auth/:path*',
      },
    ]
  },
  
  // Development settings (remove in production)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables available to the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'http://localhost:8000/api/v1' : '/api/v1'),
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL || (process.env.NODE_ENV === 'production' ? 'http://localhost:8001/api/v1/auth' : '/api/v1/auth'),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

export default nextConfig