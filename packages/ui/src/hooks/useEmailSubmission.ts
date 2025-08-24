'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribe, SubscribeApiError, fetchWithTimeout, FetchTimeoutError } from '@coquinate/shared';

/**
 * State type pentru EmailCapture form
 */
export type EmailSubmissionStatus =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | {
      kind: 'error';
      code: 'invalid_email' | 'already_subscribed' | 'rate_limited' | 'server_error';
    };

interface EmailSubmissionCallbacks {
  onSuccess?: (email: string) => void;
  onError?: (error: SubscribeApiError | FetchTimeoutError) => void;
}

interface EmailSubmissionState {
  status: EmailSubmissionStatus;
  isLoading: boolean;
  isSuccess: boolean;
  hasError: boolean;
  error: SubscribeApiError | FetchTimeoutError | null;
}

interface EmailSubmissionActions {
  submit: (
    email: string, 
    gdprConsent: boolean, 
    callbacks?: EmailSubmissionCallbacks,
    options?: { timeout?: number; honeypot?: string }
  ) => Promise<void>;
  reset: () => void;
}

export type EmailSubmissionReturn = EmailSubmissionState & EmailSubmissionActions;

/**
 * Hook pentru gestionarea submission-ului de email cu API integration
 * Gestionează AbortController, error handling și state management
 */
export function useEmailSubmission(): EmailSubmissionReturn {
  const [status, setStatus] = useState<EmailSubmissionStatus>({ kind: 'idle' });
  const [error, setError] = useState<SubscribeApiError | FetchTimeoutError | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup abort controller și track mounted state pe unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const submit = useCallback(async (
    email: string, 
    gdprConsent: boolean, 
    callbacks?: EmailSubmissionCallbacks,
    options?: { timeout?: number; honeypot?: string }
  ) => {
    // Guard contra multiple submissions
    if (status.kind === 'loading') return;

    setStatus({ kind: 'loading' });
    setError(null);

    // Anulează orice request existent
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      // Include honeypot in submission for bot detection
      const honeypotField = process.env.NEXT_PUBLIC_HONEYPOT_FIELD || 'company_website';
      const submitData = { 
        email, 
        gdprConsent,
        ...(options?.honeypot !== undefined && { [honeypotField]: options.honeypot })
      };
      
      // Use configurable timeout or default from environment
      const timeout = options?.timeout || parseInt(process.env.NEXT_PUBLIC_EMAIL_SIGNUP_TIMEOUT_MS || '8000');
      await subscribe(submitData, abortRef.current.signal, timeout);

      if (isMountedRef.current) {
        setStatus({ kind: 'success' });
        callbacks?.onSuccess?.(email);
      }
    } catch (submissionError) {
      // Handle AbortError (user cancelled)
      if (submissionError instanceof DOMException && submissionError.name === 'AbortError') {
        return;
      }

      // Doar actualizează state dacă componenta e încă mounted
      if (isMountedRef.current) {
        // Handle API errors
        if (submissionError instanceof SubscribeApiError) {
          setStatus({ kind: 'error', code: submissionError.code });
          setError(submissionError);
          callbacks?.onError?.(submissionError);
        } else if (submissionError instanceof FetchTimeoutError) {
          // Handle timeout errors
          const timeoutError = new SubscribeApiError(
            `Request timed out after ${(submissionError as FetchTimeoutError).timeout}ms`, 
            'server_error', 
            0
          );
          setStatus({ kind: 'error', code: 'server_error' });
          setError(timeoutError);
          callbacks?.onError?.(timeoutError);
        } else {
          // Handle unexpected errors
          const serverError = new SubscribeApiError('Unknown error', 'server_error', 0);
          setStatus({ kind: 'error', code: 'server_error' });
          setError(serverError);
          callbacks?.onError?.(serverError);
        }
      }
    }
  }, [status.kind]);

  const reset = useCallback(() => {
    setStatus({ kind: 'idle' });
    setError(null);
    abortRef.current?.abort();
  }, []);

  return {
    status,
    isLoading: status.kind === 'loading',
    isSuccess: status.kind === 'success',
    hasError: status.kind === 'error',
    error,
    submit,
    reset,
  };
}