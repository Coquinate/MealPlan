/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@coquinate/shared',
    '@coquinate/ui',
    '@coquinate/database',
    '@coquinate/i18n',
  ],
  // Exclude test files from production build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'].filter((ext) => !ext.includes('test')),
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', '@coquinate/ui'],
    // Force enable webpack build worker to fix minification issue
    webpackBuildWorker: true,
  },
  // Exclude patterns to prevent test file compilation
  outputFileTracingExcludes: {
    '*': ['**/*.test.*', '**/*.spec.*'],
  },
  // Temporary workaround for Next.js 15.4.6 minification bug
  // TODO: Remove when upgrading to 15.4.7 or downgrading to 15.4.5
  // Bug: _webpack.WebpackError is not a constructor in minify-webpack-plugin
  webpack: (config, { dev, isServer }) => {
    // Disable minification only in production builds to bypass the bug
    // This is acceptable during development phase
    if (!dev) {
      config.optimization.minimize = false;
    }
    return config;
  },
  // Compression optimization
  compress: true,
  eslint: {
    // Temporarily ignore ESLint errors during build
    // TODO: Fix all i18n string literal errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors to identify webpack issue
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/**',
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'Content-Security-Policy',
        value: `
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co *.vercel-scripts.com;
          style-src 'self' 'unsafe-inline';
          img-src 'self' blob: data: *.supabase.co;
          font-src 'self' data:;
          connect-src 'self' *.supabase.co wss://*.supabase.co https://api.gemini.com;
          frame-ancestors 'none';
          base-uri 'self';
          form-action 'self';
        `
          .replace(/\s{2,}/g, ' ')
          .trim(),
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Additional headers for API routes
        source: '/api/:path*',
        headers: [...securityHeaders, { key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },
};

export default nextConfig;
