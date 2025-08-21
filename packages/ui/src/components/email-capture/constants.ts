/**
 * Constante pentru EmailCapture component
 */

export const EMAIL_CAPTURE_DEFAULTS = {
  placeholder: 'email.placeholder',
  buttonText: 'email.button',
  ctaText: 'hero.cta',
  phaseInfo: 'email.phase_info',
  loadingText: 'email.loading',
  successText: 'email.success',
  emailLabel: 'email.label',
} as const;

export const EMAIL_CAPTURE_VARIANTS = ['glass', 'simple', 'inline', 'promo'] as const;

export const EMAIL_ERROR_CODES = [
  'invalid_email',
  'already_subscribed', 
  'rate_limited',
  'server_error'
] as const;

export const ANIMATION_DURATIONS = {
  particleDisplay: 3000, // ms
  buttonTransition: 300, // ms
  inputTransition: 200, // ms
} as const;

export const PROMO_VARIANT_CONFIG = {
  title: 'Primii 500 înscriși primesc o lună de acces gratuit!',
  placeholder: 'adresa@email.com',
  buttonText: 'Prinde oferta!',
  loadingText: 'Se trimite...',
  gdprText: 'Sunt de acord cu',
  gdprLinkText: 'Politica de Confidențialitate',
  gdprLinkUrl: '/politica-de-confidentialitate',
  gdprSuffix: 'și doresc să primesc comunicări prin e-mail.',
  benefitText: 'primesc un trial extins la 7 zile!',
  benefitPrefix: 'Toți înscrișii',
} as const;

export type EmailCaptureVariant = typeof EMAIL_CAPTURE_VARIANTS[number];
export type EmailErrorCode = typeof EMAIL_ERROR_CODES[number];