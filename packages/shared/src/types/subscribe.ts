import { z } from 'zod';

/**
 * Subscribe API contract types
 */

export const SubscribeRequest = z.object({
  email: z.string().email('Email invalid'),
});
export type SubscribeRequest = z.infer<typeof SubscribeRequest>;

export const SubscribeResponse = z.object({
  status: z.literal('ok'),
  id: z.string().uuid().optional(),
  message: z.string().optional(),
});
export type SubscribeResponse = z.infer<typeof SubscribeResponse>;

export const SubscribeError = z.object({
  status: z.literal('error'),
  code: z.enum(['invalid_email', 'already_subscribed', 'rate_limited', 'server_error']),
  message: z.string().optional(),
});
export type SubscribeError = z.infer<typeof SubscribeError>;

export const SubscribeResult = z.union([SubscribeResponse, SubscribeError]);
export type SubscribeResult = z.infer<typeof SubscribeResult>;

// Error code type for type-safe error handling
export type SubscribeErrorCode = SubscribeError['code'];
