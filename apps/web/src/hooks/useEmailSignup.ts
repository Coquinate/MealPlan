import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@coquinate/i18n';
import { logger } from '@/lib/logger';

/**
 * Zod schema for email signup form validation
 */
const emailSignupSchema = z.object({
  email: z.string().min(1, 'email.required').email('email.invalid').max(255, 'email.too_long'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'gdpr.required',
  }),
});

export type EmailSignupFormData = z.infer<typeof emailSignupSchema>;

export type EmailSignupStatus = 'idle' | 'loading' | 'success' | 'error';

export interface EmailSignupResult {
  isEarlyBird?: boolean;
  success: boolean;
  error?: string;
}

/**
 * Custom hook for email signup form logic and API communication
 * Separates business logic from UI rendering
 */
export function useEmailSignup() {
  const { t } = useTranslation('landing');
  const [submitStatus, setSubmitStatus] = useState<EmailSignupStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isEarlyBird, setIsEarlyBird] = useState<boolean>(false);

  const form = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      email: '',
      gdprConsent: false,
    },
  });

  const submitEmail = async (data: EmailSignupFormData): Promise<EmailSignupResult> => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMsg = t('email.error');
        
        if (response.status === 429) {
          errorMsg = t('email.rate_limit');
        } else if (response.status === 409) {
          errorMsg = t('email.already_exists');
        } else if (result.error) {
          errorMsg = result.error;
        }

        setErrorMessage(errorMsg);
        setSubmitStatus('error');
        
        return { success: false, error: errorMsg };
      }

      // Success case
      const isEarlyBirdResult = Boolean(result.isEarlyBird);
      setIsEarlyBird(isEarlyBirdResult);
      setSubmitStatus('success');
      form.reset();

      return { success: true, isEarlyBird: isEarlyBirdResult };

    } catch (error) {
      logger.error('Error submitting email', error instanceof Error ? error : new Error(String(error)));
      const errorMsg = t('email.error');
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
      
      return { success: false, error: errorMsg };
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    setErrorMessage('');
    setIsEarlyBird(false);
    form.reset();
  };

  return {
    // Form state
    form,
    
    // Submission state
    submitStatus,
    errorMessage,
    isEarlyBird,
    
    // Actions
    submitEmail,
    resetForm,
    
    // Computed properties
    isLoading: submitStatus === 'loading',
    isSuccess: submitStatus === 'success',
    isError: submitStatus === 'error',
    isIdle: submitStatus === 'idle',
  };
}