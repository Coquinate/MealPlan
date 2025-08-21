/**
 * Hook exports for UI package
 * @module hooks
 */

export { useI18nWithFallback } from './useI18nWithFallback';
export { useEmailValidation } from './useEmailValidation';
export { useEmailSubmission } from './useEmailSubmission';
export { useFloatingElements } from './useFloatingElements';
export { useSubscriberCount } from './useSubscriberCount';

export type { EmailValidationReturn } from './useEmailValidation';
export type { EmailSubmissionReturn, EmailSubmissionStatus } from './useEmailSubmission';
export type { FloatingElementsReturn } from './useFloatingElements';
export type { SubscriberCount } from './useSubscriberCount';