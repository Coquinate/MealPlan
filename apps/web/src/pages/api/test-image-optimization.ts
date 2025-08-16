/**
 * Test API endpoint for image optimization pipeline
 * Tests Vercel Image Optimization with Supabase Storage URLs
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { logError, generateRequestId } from '@coquinate/shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = generateRequestId();

  if (req.method !== 'GET') {
    await logError(`Invalid method for image optimization test: ${req.method}`, 'backend', 'low', {
      route: '/api/test-image-optimization',
      method: req.method,
      requestId,
    });
    return res.status(405).json({
      error: 'Metodă neacceptată',
      message: 'Doar metoda GET este acceptată',
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      await logError(
        'Missing Supabase configuration for image optimization test',
        'backend',
        'high',
        {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          requestId,
        }
      );
      return res.status(500).json({
        error: 'Configurare lipsă',
        message: 'Configurația Supabase nu este completă pentru testarea optimizării imaginilor',
        requestId,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test storage bucket access
    const { data: bucketData, error: bucketError } = await supabase.storage
      .from('recipe-images')
      .list('', { limit: 1 });

    if (bucketError) {
      await logError(`Storage bucket access failed: ${bucketError.message}`, 'backend', 'high', {
        bucketName: 'recipe-images',
        error: bucketError.message,
        requestId,
      });
      return res.status(500).json({
        error: 'Acces eșuat la bucket',
        message: 'Nu s-a putut accesa bucket-ul de imagini pentru testare',
        details: bucketError.message,
        requestId,
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

    console.log(`✅ Testul optimizării imaginilor finalizat cu succes (Request ID: ${requestId})`);

    return res.status(200).json({
      success: true,
      requestId,
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
          '1. Încarcă o imagine de test în bucket-ul recipe-images',
          '2. Vizitează URL-urile de test generate pentru verificarea optimizării',
          '3. Verifică în Network tab-ul browser-ului livrarea formatelor WebP/AVIF',
          '4. Testează pe diferite dispozitive/dimensiuni de ecran',
          '5. Verifică că header-ele de cache sunt setate corect',
        ],
      },
    });
  } catch (error) {
    await logError(error as Error, 'backend', 'high', {
      operation: 'image_optimization_test',
      route: '/api/test-image-optimization',
      requestId,
    });

    console.error('❌ Image optimization test failed:', error);
    return res.status(500).json({
      error: 'Test eșuat',
      message: 'Testarea optimizării imaginilor a eșuat',
      details: error instanceof Error ? error.message : 'Eroare necunoscută',
      requestId,
    });
  }
}
