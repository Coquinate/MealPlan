import { z } from 'zod';
import { EmailValidationSchema } from '../utils/email-validation';

/**
 * Subscribe API contract types
 */

export const SubscribeRequest = EmailValidationSchema.extend({
  // Allow additional fields for honeypot and other anti-bot measures
}).passthrough();
export type SubscribeRequest = z.infer<typeof SubscribeRequest>;

export const SubscribeResponse = z.object({
  success: z.literal(true),
  isEarlyBird: z.boolean(),
  signupOrder: z.number(),
});
export type SubscribeResponse = z.infer<typeof SubscribeResponse>;

export const SubscribeError = z.object({
  error: z.string(),
  retryAfter: z.number().optional(), // for rate limiting
  details: z.any().optional(), // for validation errors
});
export type SubscribeError = z.infer<typeof SubscribeError>;

export const SubscribeResult = z.union([SubscribeResponse, SubscribeError]);
export type SubscribeResult = z.infer<typeof SubscribeResult>;

// Error code type for type-safe error handling
export type SubscribeErrorCode = 'invalid_email' | 'already_subscribed' | 'rate_limited' | 'server_error';
