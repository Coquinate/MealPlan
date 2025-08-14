import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime: number;
    };
    supabase: {
      status: 'up' | 'down';
    };
  };
  environment: 'production' | 'preview' | 'development';
}

/**
 * Health Check API Endpoint
 *
 * Provides system health status including:
 * - Database connectivity test
 * - Supabase service availability
 * - Response times
 * - Environment information
 *
 * Used by the HealthStatus component on the landing page
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    // Initialize health check response
    const healthResponse: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) || 'development',
      environment: (process.env.VERCEL_ENV as any) || 'development',
      checks: {
        database: {
          status: 'down',
          responseTime: 0,
        },
        supabase: {
          status: 'down',
        },
      },
    };

    // Test database connectivity
    const dbStartTime = Date.now();
    let dbStatus: 'up' | 'down' = 'down';
    let dbResponseTime = 0;

    try {
      // Use environment variables directly for health check
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Simple health check query - just check if we can connect
        const { error } = await supabase.from('users').select('count').limit(1);

        if (!error) {
          dbStatus = 'up';
          dbResponseTime = Date.now() - dbStartTime;
        } else {
          console.warn('Database health check failed:', error);
        }
      } else {
        console.warn('Missing Supabase environment variables');
      }
    } catch (error) {
      console.error('Database connection failed:', error);
    }

    // Update health check response
    healthResponse.checks.database = {
      status: dbStatus,
      responseTime: dbResponseTime,
    };

    healthResponse.checks.supabase = {
      status: dbStatus, // For now, Supabase status is same as database status
    };

    // Determine overall status
    if (dbStatus === 'up') {
      if (dbResponseTime > 1000) {
        healthResponse.status = 'degraded';
      } else {
        healthResponse.status = 'healthy';
      }
    } else {
      healthResponse.status = 'unhealthy';
    }

    // Set appropriate cache headers
    const cacheTime = healthResponse.status === 'healthy' ? 30 : 5; // seconds
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`
    );

    return res.status(200).json(healthResponse);
  } catch (error) {
    console.error('Health check failed:', error);

    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) || 'development',
      environment: (process.env.VERCEL_ENV as any) || 'development',
      checks: {
        database: {
          status: 'down',
          responseTime: Date.now() - startTime,
        },
        supabase: {
          status: 'down',
        },
      },
    } as HealthCheckResponse);
  }
}
