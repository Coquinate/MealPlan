/**
 * Fetch with timeout utility
 * Provides robust network handling with configurable timeout
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
}

/**
 * Fetch with timeout support
 * @param url Request URL
 * @param options Fetch options with optional timeout
 * @returns Promise with Response
 */
export async function fetchWithTimeout(
  url: string, 
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 8000, ...fetchOptions } = options;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Merge abort signals if provided
    const signal = fetchOptions.signal 
      ? AbortSignal.any([fetchOptions.signal, controller.signal])
      : controller.signal;
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle timeout specifically
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new FetchTimeoutError(`Request timed out after ${timeout}ms`, timeout);
    }
    
    throw error;
  }
}

/**
 * Custom timeout error class
 */
export class FetchTimeoutError extends Error {
  public readonly name = 'FetchTimeoutError';
  public readonly timeout: number;
  
  constructor(message: string, timeout: number) {
    super(message);
    this.timeout = timeout;
  }
}

/**
 * Retry fetch with exponential backoff
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithTimeoutOptions & { 
    retries?: number;
    retryDelay?: number;
    retryMultiplier?: number;
  } = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    retryMultiplier = 2,
    ...fetchOptions
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // Don't retry on successful responses
      if (response.ok) {
        return response;
      }
      
      // Retry on server errors (5xx) if we have attempts left
      if (attempt < retries) {
        await sleep(retryDelay * Math.pow(retryMultiplier, attempt));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on abort errors (user cancelled)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      
      // Retry on network errors if we have attempts left
      if (attempt < retries) {
        await sleep(retryDelay * Math.pow(retryMultiplier, attempt));
        continue;
      }
    }
  }
  
  throw lastError!;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * AbortSignal.any polyfill for older browsers
 */
function combineAbortSignals(...signals: (AbortSignal | undefined)[]): AbortSignal {
  const validSignals = signals.filter(Boolean) as AbortSignal[];
  
  if (validSignals.length === 0) {
    return new AbortController().signal;
  }
  
  if (validSignals.length === 1) {
    return validSignals[0];
  }
  
  // Use native AbortSignal.any if available
  if ('any' in AbortSignal) {
    return (AbortSignal as any).any(validSignals);
  }
  
  // Polyfill for older browsers
  const controller = new AbortController();
  
  for (const signal of validSignals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  
  return controller.signal;
}