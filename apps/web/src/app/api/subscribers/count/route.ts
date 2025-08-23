import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const revalidate = 30;

/**
 * API Route: GET /api/subscribers/count
 * Returns real-time count of email signups from Supabase
 * Used for progress bar and counter displays
 */
export async function GET() {
  try {
    // Create Supabase client with service role for data access
    const supabase = createServerClient();

    // Get current count of signups
    const { count, error } = await supabase
      .from('email_signups')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Failed to fetch subscriber count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriber count' },
        { status: 500 }
      );
    }

    // Calculate early bird status (first 500)
    const current = count || 0;
    const total = 500;
    const isEarlyBirdAvailable = current < total;
    const remaining = Math.max(0, total - current);
    const progressPercentage = Math.min(100, (current / total) * 100);

    return NextResponse.json({
      current,
      total,
      remaining,
      progressPercentage: Math.round(progressPercentage * 10) / 10, // Round to 1 decimal
      isEarlyBirdAvailable,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Unexpected error in subscribers count API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}