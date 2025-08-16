import { http, HttpResponse, delay } from 'msw';
import type { SubscribeRequest, SubscribeResponse } from '@coquinate/shared';

const baseUrl = '/api/subscribe';

/**
 * MSW handlers for subscribe API
 * Provides reusable mock scenarios for Storybook stories
 */

function success(payload?: Partial<SubscribeResponse>) {
  return http.post(baseUrl, async ({ request }) => {
    const body = (await request.json()) as SubscribeRequest;
    if (!body?.email) {
      return HttpResponse.json(
        { status: 'error', code: 'invalid_email', message: 'Email is required' },
        { status: 400 }
      );
    }

    await delay(300); // Realistic API delay

    return HttpResponse.json(
      {
        status: 'ok',
        id: crypto.randomUUID(),
        message: 'Te-ai abonat cu succes! Verifică emailul.',
        ...payload,
      },
      { status: 200 }
    );
  });
}

function invalidEmail() {
  return http.post(baseUrl, async () => {
    await delay(200);
    return HttpResponse.json(
      {
        status: 'error',
        code: 'invalid_email',
        message: 'Adresa de email nu este validă',
      },
      { status: 400 }
    );
  });
}

function alreadySubscribed() {
  return http.post(baseUrl, async () => {
    await delay(300);
    return HttpResponse.json(
      {
        status: 'error',
        code: 'already_subscribed',
        message: 'Ești deja abonat la newsletter',
      },
      { status: 409 }
    );
  });
}

function rateLimited() {
  return http.post(baseUrl, async () => {
    await delay(100);
    return HttpResponse.json(
      {
        status: 'error',
        code: 'rate_limited',
        message: 'Prea multe încercări. Încearcă din nou în 5 minute.',
      },
      { status: 429 }
    );
  });
}

function serverError() {
  return http.post(baseUrl, async () => {
    await delay(1000);
    return HttpResponse.json(
      {
        status: 'error',
        code: 'server_error',
        message: 'Eroare de server. Te rugăm să încerci din nou.',
      },
      { status: 500 }
    );
  });
}

function slowSuccess(ms = 1500) {
  return http.post(baseUrl, async ({ request }) => {
    const body = (await request.json()) as SubscribeRequest;
    await delay(ms);

    return HttpResponse.json(
      {
        status: 'ok',
        id: crypto.randomUUID(),
        message: 'Te-ai abonat cu succes! Verifică emailul.',
      },
      { status: 200 }
    );
  });
}

function networkError() {
  return http.post(baseUrl, async () => {
    // Simulate network failure
    return HttpResponse.error();
  });
}

/**
 * Subscribe API mock handlers
 * Import and use in Storybook stories via parameters.msw.handlers
 */
export const subscribeHandlers = {
  success,
  invalidEmail,
  alreadySubscribed,
  rateLimited,
  serverError,
  slowSuccess,
  networkError,
};

// Default handlers for global MSW setup
export const defaultSubscribeHandlers = [subscribeHandlers.success()];
