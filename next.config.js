/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Directory включен по умолчанию в Next.js 14
  experimental: {
    typedRoutes: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig