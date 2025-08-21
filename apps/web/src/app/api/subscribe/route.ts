import { NextRequest, NextResponse } from 'next/server';
import { SubscribeRequest, SubscribeResult } from '@coquinate/shared/types';
import { apiLogger } from '@/lib/logger';

/**
 * POST /api/subscribe
 * Adapter endpoint that wraps /api/email-signup to match the expected SubscribeResult interface
 * This allows the subscribe() client function to work with our existing email signup logic.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body using the shared schema
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'server_error',
          message: 'Invalid JSON in request body',
        } satisfies SubscribeResult,
        { status: 400 }
      );
    }

    // Validate using SubscribeRequest schema
    const validation = SubscribeRequest.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'invalid_email',
          message: 'Invalid email format',
        } satisfies SubscribeResult,
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Forward the request to the existing email-signup endpoint
    // Include GDPR consent as required by the email-signup endpoint
    const signupPayload = {
      email,
      gdprConsent: true, // For subscribe endpoint, we assume consent is implicit
    };

    // Get the base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const signupUrl = new URL('/api/email-signup', baseUrl);

    // Forward the request to email-signup endpoint
    const signupResponse = await fetch(signupUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward important headers from the original request
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify(signupPayload),
    });

    const signupData = await signupResponse.json();

    // Transform the response to match SubscribeResult interface
    if (signupResponse.ok) {
      // Success case: { success: true, isEarlyBird: boolean, signupOrder: number }
      return NextResponse.json(
        {
          status: 'ok',
          id: signupData.signupOrder?.toString(), // Use signup order as ID
          message: signupData.isEarlyBird 
            ? 'Successfully subscribed! You are in the early bird group.' 
            : 'Successfully subscribed!',
        } satisfies SubscribeResult,
        { status: 200 }
      );
    } else {
      // Error cases - transform specific error messages to appropriate codes
      let errorCode: 'invalid_email' | 'already_subscribed' | 'rate_limited' | 'server_error' = 'server_error';
      
      if (signupResponse.status === 429) {
        errorCode = 'rate_limited';
      } else if (signupResponse.status === 409) {
        // Unique constraint violation - already subscribed
        errorCode = 'already_subscribed';
      } else if (signupResponse.status === 400 && signupData.error?.toLowerCase().includes('email')) {
        errorCode = 'invalid_email';
      }

      return NextResponse.json(
        {
          status: 'error',
          code: errorCode,
          message: signupData.error || 'An error occurred during subscription',
        } satisfies SubscribeResult,
        { status: signupResponse.status }
      );
    }

  } catch (error) {
    apiLogger.error('Error in /api/subscribe endpoint', error instanceof Error ? error : new Error(String(error)));
    
    return NextResponse.json(
      {
        status: 'error',
        code: 'server_error',
        message: 'An unexpected error occurred',
      } satisfies SubscribeResult,
      { status: 500 }
    );
  }
}

/**
 * GET /api/subscribe
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Subscribe endpoint is running',
    timestamp: new Date().toISOString(),
  });
}