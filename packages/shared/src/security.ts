/**
 * Security utilities export for server-side usage
 * This file exports only security-related utilities without React dependencies
 */

// Email validation utilities
export {
  EmailValidationSchema,
  FrontendEmailValidationSchema,
  validateEmail,
  validateEmailWithDNS,
  validateDomainDNS,
  sanitizeEmail,
  MAX_EMAIL_LENGTH,
  MAX_LOCAL_PART_LENGTH,
  EMAIL_REGEX,
  STRICT_EMAIL_REGEX,
  DISPOSABLE_EMAIL_DOMAINS,
  MALICIOUS_EMAIL_DOMAINS,
  isDisposableEmail,
  isMaliciousEmail,
} from './utils/email-validation';

// Anti-bot protection utilities  
export {
  DEFAULT_ANTI_BOT_CONFIG,
  startBotDetection,
  recordKeystroke,
  recordFocus,
  recordBlur,
  performBotCheck,
  getTimeUntilSubmission,
  generateHoneypotField,
  analyzeBotBehavior,
  type AntiBotConfig,
  type BotDetectionState,
  type AntiBotHookState,
} from './utils/anti-bot';

// Fetch utilities
export {
  fetchWithTimeout,
  FetchTimeoutError,
  type FetchWithTimeoutOptions,
} from './utils/fetch-with-timeout';

// Subscribe client utilities
export {
  subscribe,
  SubscribeApiError,
} from './utils/subscribe-client';