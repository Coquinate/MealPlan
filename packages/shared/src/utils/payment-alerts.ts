/**
 * Sistema de alerte pentru eșecuri de plăți Stripe
 * Implementează notificări instantanee pentru administratori când plățile eșuează
 */

import { logError, createErrorContext, generateRequestId } from './error-logging';
import { sendEmailAlert, sendDiscordAlert } from './email-notifications';

export interface PaymentFailureContext {
  /** ID-ul plății în Stripe */
  paymentIntentId?: string;
  /** ID-ul utilizatorului care a încercat plata */
  userId?: string;
  /** Suma plății în bani (cents) */
  amount?: number;
  /** Moneda plății */
  currency?: string;
  /** Codul de eroare Stripe */
  stripeErrorCode?: string;
  /** Mesajul de eroare Stripe */
  stripeErrorMessage?: string;
  /** Tipul de card folosit */
  paymentMethodType?: string;
  /** Identificatorul webhook-ului */
  webhookId?: string;
  /** Încercări de retry anterioare */
  previousAttempts?: number;
  /** Contextul suplimentar de eroare */
  additionalContext?: Record<string, unknown>;
}

export interface PaymentRetryConfig {
  /** Numărul maxim de reîncercări */
  maxAttempts: number;
  /** Intervalul inițial între reîncercări (ms) */
  initialDelay: number;
  /** Multiplicatorul pentru backoff exponential */
  backoffMultiplier: number;
  /** Delay-ul maxim între reîncercări (ms) */
  maxDelay: number;
}

/**
 * Configurația implicită pentru reîncercările de plăți
 */
const DEFAULT_RETRY_CONFIG: PaymentRetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 secundă
  backoffMultiplier: 2,
  maxDelay: 30000, // 30 secunde
};

/**
 * Loghează eșecul unei plăți și trimite alerte instantanee
 * @param context - Contextul eșecului de plată
 * @param severity - Severitatea eșecului
 * @returns Promise<boolean> - True dacă alertele au fost trimise cu succes
 */
export async function logPaymentFailure(
  context: PaymentFailureContext,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'high'
): Promise<boolean> {
  try {
    // Creează mesajul de eroare
    const errorMessage = context.stripeErrorMessage || 'Payment failure occurred';

    // Creează contextul suplimentar
    const additionalContext = {
      paymentIntentId: context.paymentIntentId,
      amount: context.amount,
      currency: context.currency,
      stripeErrorCode: context.stripeErrorCode,
      paymentMethodType: context.paymentMethodType,
      webhookId: context.webhookId,
      previousAttempts: context.previousAttempts,
      userId: context.userId,
      route: '/api/webhooks/stripe',
      requestId: `payment_${context.paymentIntentId || Date.now()}`,
      userAgent: 'Stripe-Webhook',
      ...context.additionalContext,
    };

    // Loghează eroarea structurat
    await logError(errorMessage, 'payment', severity, additionalContext);

    // Prepară mesajul pentru alerte
    const alertMessage = createPaymentAlertMessage(context);

    // Trimite alertele în paralel
    const [emailSent, discordSent] = await Promise.all([
      sendEmailAlert(alertMessage, severity, additionalContext),
      sendDiscordAlert(alertMessage, severity, additionalContext),
    ]);

    return emailSent || discordSent;
  } catch (error) {
    console.error('Eroare la trimiterea alertelor pentru eșecul de plată:', error);
    return false;
  }
}

/**
 * Creează un mesaj de alertă pentru eșecul de plată
 * @param context - Contextul eșecului de plată
 * @returns Mesajul formatat pentru alertă
 */
function createPaymentAlertMessage(context: PaymentFailureContext): string {
  const amount = context.amount
    ? `${context.amount / 100} ${(context.currency || 'RON').toUpperCase()}`
    : 'necunoscută';

  const parts = ['🚨 ALERTĂ EȘEC PLATĂ', `💳 Suma: ${amount}`];

  if (context.stripeErrorCode) {
    parts.push(`⚠️ Cod eroare: ${context.stripeErrorCode}`);
  }

  if (context.stripeErrorMessage) {
    parts.push(`📝 Mesaj: ${context.stripeErrorMessage}`);
  }

  if (context.paymentIntentId) {
    parts.push(`🔗 Payment Intent: ${context.paymentIntentId}`);
  }

  if (context.userId) {
    parts.push(`👤 Utilizator: ${context.userId}`);
  }

  if (context.previousAttempts && context.previousAttempts > 0) {
    parts.push(`🔄 Încercări anterioare: ${context.previousAttempts}`);
  }

  return parts.join('\n');
}

/**
 * Determină severitatea unui eșec de plată bazat pe codul de eroare Stripe
 * @param stripeErrorCode - Codul de eroare de la Stripe
 * @param previousAttempts - Numărul încercărilor anterioare
 * @returns Severitatea eșecului
 */
export function determinePaymentFailureSeverity(
  stripeErrorCode?: string,
  previousAttempts: number = 0
): 'low' | 'medium' | 'high' | 'critical' {
  // Erori critice care necesită atenție imediată
  const criticalErrors = [
    'card_declined',
    'expired_card',
    'insufficient_funds',
    'processing_error',
  ];

  // Erori de severitate mare
  const highSeverityErrors = [
    'incorrect_cvc',
    'incorrect_number',
    'invalid_expiry_month',
    'invalid_expiry_year',
  ];

  // Erori temporare (severitate medie)
  const temporaryErrors = ['rate_limit_error', 'api_connection_error', 'api_error'];

  // Escaladează severitatea bazată pe numărul de încercări
  if (previousAttempts >= 3) {
    return 'critical';
  } else if (previousAttempts >= 2) {
    return 'high';
  }

  if (!stripeErrorCode) {
    return 'medium';
  }

  if (criticalErrors.includes(stripeErrorCode)) {
    return 'critical';
  } else if (highSeverityErrors.includes(stripeErrorCode)) {
    return 'high';
  } else if (temporaryErrors.includes(stripeErrorCode)) {
    return 'medium';
  }

  return 'low';
}

/**
 * Calculează delay-ul pentru următoarea reîncercare
 * @param attempt - Numărul încercării curente (începe de la 1)
 * @param config - Configurația pentru reîncercări
 * @returns Delay-ul în milisecunde
 */
export function calculateRetryDelay(
  attempt: number,
  config: PaymentRetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Verifică dacă o plată poate fi reîncercată bazat pe codul de eroare
 * @param stripeErrorCode - Codul de eroare de la Stripe
 * @param currentAttempt - Încercarea curentă
 * @param config - Configurația pentru reîncercări
 * @returns True dacă plata poate fi reîncercată
 */
export function shouldRetryPayment(
  stripeErrorCode?: string,
  currentAttempt: number = 1,
  config: PaymentRetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  // Nu reîncerca dacă s-a atins limita maximă
  if (currentAttempt >= config.maxAttempts) {
    return false;
  }

  // Erori care nu trebuie reîncercate
  const nonRetryableErrors = [
    'card_declined',
    'expired_card',
    'insufficient_funds',
    'incorrect_cvc',
    'incorrect_number',
    'invalid_expiry_month',
    'invalid_expiry_year',
  ];

  if (!stripeErrorCode) {
    return true; // Reîncearcă erorile necunoscute
  }

  return !nonRetryableErrors.includes(stripeErrorCode);
}

/**
 * Formatul pentru webhook-ul Stripe
 */
export interface StripeWebhookPayload {
  id: string;
  object: 'event';
  type: string;
  data: {
    object: any;
  };
  created: number;
}

/**
 * Procesează un webhook de eșec de plată de la Stripe
 * @param payload - Payload-ul webhook-ului
 * @returns Promise<boolean> - True dacă webhook-ul a fost procesat cu succes
 */
export async function processPaymentFailureWebhook(
  payload: StripeWebhookPayload
): Promise<boolean> {
  try {
    const { type, data } = payload;

    // Verifică dacă este un event de eșec de plată
    const isPaymentFailure = [
      'payment_intent.payment_failed',
      'charge.failed',
      'invoice.payment_failed',
    ].includes(type);

    if (!isPaymentFailure) {
      return true; // Nu este un eșec de plată, nu avem ce procesa
    }

    // Extrage informațiile relevante din payload
    const paymentObject = data.object;
    const context: PaymentFailureContext = {
      paymentIntentId: paymentObject.id,
      amount: paymentObject.amount,
      currency: paymentObject.currency,
      stripeErrorCode: paymentObject.last_payment_error?.code,
      stripeErrorMessage: paymentObject.last_payment_error?.message,
      paymentMethodType: paymentObject.payment_method?.type,
      webhookId: payload.id,
      userId: paymentObject.metadata?.userId,
      previousAttempts: paymentObject.metadata?.attempt_count
        ? parseInt(paymentObject.metadata.attempt_count, 10)
        : 0,
      additionalContext: {
        webhookType: type,
        stripeEventId: payload.id,
        created: payload.created,
        lastPaymentError: paymentObject.last_payment_error,
        metadata: paymentObject.metadata,
      },
    };

    // Determină severitatea
    const severity = determinePaymentFailureSeverity(
      context.stripeErrorCode,
      context.previousAttempts
    );

    // Loghează și trimite alertele
    await logPaymentFailure(context, severity);

    return true;
  } catch (error) {
    console.error('Eroare la procesarea webhook-ului de eșec de plată:', error);
    return false;
  }
}
