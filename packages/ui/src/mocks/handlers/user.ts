import { http, HttpResponse, delay } from 'msw';

// Mock user data
export const mockUser = {
  id: '123',
  email: 'ion.popescu@example.com',
  name: 'Ion Popescu',
  preferences: {
    diet: 'mediterranean',
    allergies: ['nuci', 'lactate'],
    servings: 4,
    weeklyBudget: 500, // RON
    cookingTime: 'moderate', // quick, moderate, elaborate
    cuisinePreferences: ['română', 'italiană', 'grecească'],
  },
  subscription: {
    plan: 'premium',
    status: 'active',
    expiresAt: '2025-12-31',
  },
  stats: {
    recipesCooked: 142,
    weeksSaved: 24,
    moneySaved: 1200, // RON
  },
};

const baseUrl = '/api/user';

// Success handlers
function getProfile() {
  return http.get(`${baseUrl}/profile`, async () => {
    await delay(400);
    return HttpResponse.json({
      status: 'ok',
      data: mockUser,
    });
  });
}

function updatePreferences() {
  return http.patch(`${baseUrl}/preferences`, async ({ request }) => {
    const updates = await request.json();
    await delay(600);

    return HttpResponse.json({
      status: 'ok',
      data: {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          ...updates,
        },
      },
      message: 'Preferințele au fost actualizate',
    });
  });
}

// Auth states
function notAuthenticated() {
  return http.get(`${baseUrl}/profile`, async () => {
    await delay(200);
    return HttpResponse.json({ status: 'error', message: 'Nu ești autentificat' }, { status: 401 });
  });
}

function sessionExpired() {
  return http.get(`${baseUrl}/profile`, async () => {
    await delay(300);
    return HttpResponse.json({ status: 'error', message: 'Sesiunea a expirat' }, { status: 403 });
  });
}

// Subscription states
function freeUser() {
  return http.get(`${baseUrl}/profile`, async () => {
    await delay(400);
    return HttpResponse.json({
      status: 'ok',
      data: {
        ...mockUser,
        subscription: {
          plan: 'free',
          status: 'active',
          limitations: {
            recipesPerWeek: 3,
            mealPlansPerMonth: 1,
          },
        },
      },
    });
  });
}

function expiredSubscription() {
  return http.get(`${baseUrl}/profile`, async () => {
    await delay(400);
    return HttpResponse.json({
      status: 'ok',
      data: {
        ...mockUser,
        subscription: {
          plan: 'premium',
          status: 'expired',
          expiredAt: '2024-12-31',
          message: 'Abonamentul tău a expirat. Reînnoiește pentru a continua.',
        },
      },
    });
  });
}

// Export grouped handlers
export const userHandlers = {
  getProfile,
  updatePreferences,
  notAuthenticated,
  sessionExpired,
  freeUser,
  expiredSubscription,
};

// Default handlers for global setup
export const defaultUserHandlers = [userHandlers.getProfile(), userHandlers.updatePreferences()];
