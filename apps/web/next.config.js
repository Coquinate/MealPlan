/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@coquinate/shared',
    '@coquinate/ui',
    '@coquinate/database',
    '@coquinate/i18n',
  ],
  eslint: {
    // Temporarily ignore ESLint errors during build
    // TODO: Fix all i18n string literal errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We're fixing TypeScript errors properly
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;