/**
 * Webhook Stripe pentru procesarea evenimentelor de plăți
 * Gestionează eșecurile de plăți și trimite alerte instantanee
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import {
  processPaymentFailureWebhook,
  logPaymentFailure,
  PaymentFailureContext,
} from '@coquinate/shared';

// Configurarea Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Handler pentru webhook-urile Stripe
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Doar metoda POST este acceptată pentru webhook-uri',
    });
  }

  let event: Stripe.Event;

  try {
    // Obține body-ul raw pentru verificarea semnăturii
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      console.error('❌ Lipsește headerul stripe-signature');
      return res.status(400).json({
        error: 'Missing signature',
        message: 'Header-ul Stripe signature este necesar',
      });
    }

    if (!endpointSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET nu este configurat');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Webhook secret nu este configurat',
      });
    }

    // Verifică semnătura webhook-ului
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);

    console.log(`✅ Webhook Stripe primit: ${event.type} (ID: ${event.id})`);
  } catch (error) {
    console.error('❌ Eroare la verificarea webhook-ului Stripe:', error);

    // Loghează eroarea de verificare
    await logPaymentFailure(
      {
        webhookId: 'webhook_verification_failed',
        stripeErrorMessage: error instanceof Error ? error.message : 'Webhook verification failed',
        additionalContext: {
          error: error instanceof Error ? error.message : String(error),
          signature: req.headers['stripe-signature'],
          hasSecret: !!endpointSecret,
        },
      },
      'critical'
    );

    return res.status(400).json({
      error: 'Webhook signature verification failed',
      message: 'Semnătura webhook-ului nu poate fi verificată',
    });
  }

  try {
    // Procesează evenimentul în funcție de tip
    await handleStripeEvent(event);

    // Confirmă primirea cu succes
    res.status(200).json({
      received: true,
      eventId: event.id,
      type: event.type,
    });
  } catch (error) {
    console.error(`❌ Eroare la procesarea evenimentului ${event.type}:`, error);

    // Loghează eroarea de procesare
    await logPaymentFailure(
      {
        webhookId: event.id,
        stripeErrorMessage: error instanceof Error ? error.message : 'Event processing failed',
        additionalContext: {
          eventType: event.type,
          eventId: event.id,
          error: error instanceof Error ? error.message : String(error),
          eventData: event.data,
        },
      },
      'critical'
    );

    res.status(500).json({
      error: 'Event processing failed',
      message: 'Eroare la procesarea evenimentului Stripe',
      eventId: event.id,
    });
  }
}

/**
 * Procesează evenimentele Stripe și trimite alerte pentru eșecuri
 */
async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // Filtrează doar evenimentele relevante pentru a evita procesarea inutilă
  const relevantEvents = [
    'payment_intent.payment_failed',
    'payment_intent.succeeded',
    'charge.failed',
    'charge.succeeded',
    'invoice.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ];

  if (!relevantEvents.includes(event.type)) {
    console.log(`⏭️ Eveniment ignorat: ${event.type} (nu este relevant)`);
    return; // Exit early pentru evenimente nerelevante
  }

  console.log(`🔄 Procesare eveniment: ${event.type}`);

  switch (event.type) {
    // Eșecuri de plată
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    case 'charge.failed':
      await handleChargeFailed(event.data.object as Stripe.Charge);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    // Evenimente de succes (pentru monitorizare)
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;

    case 'charge.succeeded':
      console.log(`✅ Plată reușită: ${(event.data.object as Stripe.Charge).id}`);
      break;

    // Evenimente de configurare
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      console.log(`📋 Eveniment abonament: ${event.type}`);
      break;

    default:
      console.log(`ℹ️ Eveniment neprocesat: ${event.type}`);
  }

  // Folosește utilitarul de procesare pentru toate eșecurile de plată
  await processPaymentFailureWebhook({
    id: event.id,
    object: 'event',
    type: event.type,
    data: event.data,
    created: event.created,
  });
}

/**
 * Gestionează eșecul unui Payment Intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const lastError = paymentIntent.last_payment_error;

  console.log(`❌ Payment Intent eșuat: ${paymentIntent.id}`);
  console.log(`   Suma: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`);
  if (lastError) {
    console.log(`   Cod eroare: ${lastError.code}`);
    console.log(`   Mesaj: ${lastError.message}`);
  }

  const context: PaymentFailureContext = {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    stripeErrorCode: lastError?.code,
    stripeErrorMessage: lastError?.message,
    paymentMethodType: lastError?.payment_method?.type,
    userId: paymentIntent.metadata?.userId,
    previousAttempts: paymentIntent.metadata?.attempt_count
      ? parseInt(paymentIntent.metadata.attempt_count, 10)
      : 0,
    additionalContext: {
      status: paymentIntent.status,
      clientSecret: `${paymentIntent.client_secret?.substring(0, 20)}...`,
      metadata: paymentIntent.metadata,
      lastPaymentError: lastError,
    },
  };

  await logPaymentFailure(context, 'critical');
}

/**
 * Gestionează eșecul unei încărcări
 */
async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  console.log(`❌ Charge eșuat: ${charge.id}`);
  console.log(`   Suma: ${charge.amount / 100} ${charge.currency.toUpperCase()}`);

  if (charge.failure_code) {
    console.log(`   Cod eșec: ${charge.failure_code}`);
  }
  if (charge.failure_message) {
    console.log(`   Mesaj eșec: ${charge.failure_message}`);
  }

  const context: PaymentFailureContext = {
    paymentIntentId: charge.payment_intent as string,
    amount: charge.amount,
    currency: charge.currency,
    stripeErrorCode: charge.failure_code || undefined,
    stripeErrorMessage: charge.failure_message || undefined,
    paymentMethodType: charge.payment_method_details?.type,
    userId: charge.metadata?.userId,
    additionalContext: {
      chargeId: charge.id,
      status: charge.status,
      paid: charge.paid,
      refunded: charge.refunded,
      metadata: charge.metadata,
      outcome: charge.outcome,
    },
  };

  await logPaymentFailure(context, 'high');
}

/**
 * Gestionează eșecul plății unei facturi
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.log(`❌ Plată factură eșuată: ${invoice.id}`);
  console.log(`   Suma: ${invoice.amount_due / 100} ${invoice.currency.toUpperCase()}`);

  const context: PaymentFailureContext = {
    paymentIntentId: invoice.payment_intent as string,
    amount: invoice.amount_due,
    currency: invoice.currency,
    stripeErrorCode: 'invoice_payment_failed',
    stripeErrorMessage: `Plata facturii ${invoice.number} a eșuat`,
    userId: invoice.customer as string,
    additionalContext: {
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      status: invoice.status,
      attemptCount: invoice.attempt_count,
      subscription: invoice.subscription,
      metadata: invoice.metadata,
    },
  };

  await logPaymentFailure(context, 'high');
}

/**
 * Monitorizează plățile de succes pentru statistici
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log(`✅ Payment Intent reușit: ${paymentIntent.id}`);
  console.log(`   Suma: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`);

  // În viitor, aici putem adăuga tracking pentru succese
  // pentru a calcula rate de succes vs eșec
}
