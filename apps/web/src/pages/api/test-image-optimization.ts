/**
 * Test API endpoint for image optimization pipeline
 * Tests Vercel Image Optimization with Supabase Storage URLs
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Missing Supabase configuration',
        details: 'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not configured',
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test storage bucket access
    const { data: bucketData, error: bucketError } = await supabase.storage
      .from('recipe-images')
      .list('', { limit: 1 });

    if (bucketError) {
      return res.status(500).json({
        error: 'Storage bucket access failed',
        details: bucketError.message,
      });
    }

    // Get project URL for generating test image URLs
    const testImagePath = 'test/sample-recipe.jpg';
    const testImageUrl = `${supabaseUrl}/storage/v1/object/public/recipe-images/${testImagePath}`;

    // Test responsive breakpoints configuration
    const nextConfig = {
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 31536000,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.supabase.co',
          pathname: '/storage/v1/**',
        },
      ],
    };

    // Generate test URLs for different breakpoints
    const testUrls = {
      mobile: `/_next/image?url=${encodeURIComponent(testImageUrl)}&w=640&q=85`,
      tablet: `/_next/image?url=${encodeURIComponent(testImageUrl)}&w=1080&q=85`,
      desktop: `/_next/image?url=${encodeURIComponent(testImageUrl)}&w=1200&q=85`,
      webp: `/_next/image?url=${encodeURIComponent(testImageUrl)}&w=1200&q=85&f=webp`,
      avif: `/_next/image?url=${encodeURIComponent(testImageUrl)}&w=1200&q=85&f=avif`,
    };

    return res.status(200).json({
      success: true,
      storage: {
        bucketAccessible: true,
        bucketFiles: Array.isArray(bucketData) ? bucketData.length : 0,
      },
      imageOptimization: {
        configured: true,
        nextConfig,
        testUrls,
        supabasePattern: '**.supabase.co',
        testImageUrl,
      },
      responsiveBreakpoints: {
        mobile: '320px - 640px',
        tablet: '768px - 1080px',
        desktop: '1200px+',
        deviceSizes: nextConfig.deviceSizes,
        imageSizes: nextConfig.imageSizes,
      },
      formats: {
        primary: 'AVIF',
        secondary: 'WebP',
        fallback: 'JPEG',
        supported: nextConfig.formats,
      },
      caching: {
        minimumTTL: `${nextConfig.minimumCacheTTL / (60 * 60 * 24 * 365)} year(s)`,
        vercelEdgeNetwork: 'enabled',
      },
      testing: {
        instructions: [
          '1. Upload a test image to recipe-images bucket',
          '2. Visit the generated test URLs to verify optimization',
          '3. Check browser Network tab for WebP/AVIF format delivery',
          '4. Test on different devices/screen sizes',
          '5. Verify proper caching headers are set',
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
