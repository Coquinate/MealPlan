'use client';

import { useState, useCallback } from 'react';
import { 
  FrontendEmailValidationSchema, 
  MAX_EMAIL_LENGTH, 
  EMAIL_REGEX,
  sanitizeEmail 
} from '@coquinate/shared';

interface EmailValidationState {
  email: string;
  gdprConsent: boolean;
  isValid: boolean;
  hasError: boolean;
}

interface EmailValidationActions {
  setEmail: (email: string) => void;
  setGdprConsent: (consent: boolean) => void;
  reset: () => void;
  validate: () => boolean;
}

export type EmailValidationReturn = EmailValidationState & EmailValidationActions;

/**
 * Hook pentru gestionarea validării email și consent GDPR
 * Oferă state management și validare pentru email capture forms
 */
export function useEmailValidation(): EmailValidationReturn {
  const [email, setEmailValue] = useState('');
  const [gdprConsent, setGdprConsentValue] = useState(false);

  // Validare email cu schema partajată
  const isValidEmail = useCallback((emailValue: string): boolean => {
    if (!emailValue || emailValue.length === 0) return false;
    if (emailValue.length > MAX_EMAIL_LENGTH) return false;
    return EMAIL_REGEX.test(emailValue.trim());
  }, []);

  const isValid = email.length > 0 && isValidEmail(email);
  const hasError = email.length > 0 && !isValidEmail(email);

  const setEmail = useCallback((newEmail: string) => {
    // Sanitize email input
    const sanitized = sanitizeEmail(newEmail);
    setEmailValue(sanitized);
  }, []);

  const setGdprConsent = useCallback((consent: boolean) => {
    setGdprConsentValue(consent);
  }, []);

  const reset = useCallback(() => {
    setEmailValue('');
    setGdprConsentValue(false);
  }, []);

  const validate = useCallback((): boolean => {
    return isValid;
  }, [isValid]);

  return {
    email,
    gdprConsent,
    isValid,
    hasError,
    setEmail,
    setGdprConsent,
    reset,
    validate,
  };
}