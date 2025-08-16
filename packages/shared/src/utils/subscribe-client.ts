import type { SubscribeRequest, SubscribeResponse, SubscribeErrorCode } from '../types/subscribe';
import { SubscribeResult } from '../types/subscribe';

/**
 * Subscribe API client
 */

export class SubscribeApiError extends Error {
  constructor(
    message: string,
    public readonly code: SubscribeErrorCode,
    public readonly status: number
  ) {
    super(message);
    this.name = 'SubscribeApiError';
  }
}

/**
 * Subscribe to email newsletter
 * @param req Subscribe request data
 * @param signal AbortSignal for cancellation
 * @returns Promise with subscription response
 * @throws SubscribeApiError for API errors
 */
export async function subscribe(
  req: SubscribeRequest,
  signal?: AbortSignal
): Promise<SubscribeResponse> {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(req),
      signal,
    });

    const rawData = await response.json();
    const parseResult = SubscribeResult.safeParse(rawData);

    if (!parseResult.success) {
      // Log parsing error for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API response validation failed:', parseResult.error);
      }
      throw new SubscribeApiError('Invalid API response', 'server_error', response.status);
    }

    const data = parseResult.data;

    // Handle API error responses
    if (!response.ok || data.status === 'error') {
      const code = data.status === 'error' ? data.code : 'server_error';
      const message =
        data.status === 'error' ? (data.message ?? 'Subscription failed') : 'Subscription failed';
      throw new SubscribeApiError(message, code, response.status);
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof SubscribeApiError) {
      throw error;
    }

    // AbortController cancellation
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    // Generic network/parsing errors
    throw new SubscribeApiError('Network error occurred', 'server_error', 0);
  }
}
