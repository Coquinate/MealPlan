import { http, HttpResponse, delay } from 'msw';

// Romanian meal fixtures
export const mockMeals = {
  breakfast: {
    id: '1',
    name: 'Omletă cu brânză și roșii',
    type: 'breakfast',
    calories: 320,
    protein: 18,
    carbs: 12,
    fat: 22,
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    ingredients: [
      '3 ouă',
      '50g brânză telemea',
      '2 roșii medii',
      '1 lingură ulei',
      'sare, piper după gust',
    ],
    imageUrl: '/images/meals/omleta.jpg',
  },
  lunch: {
    id: '2',
    name: 'Ciorbă de burtă',
    type: 'lunch',
    calories: 450,
    protein: 28,
    carbs: 35,
    fat: 18,
    prepTime: 30,
    cookTime: 120,
    servings: 4,
    ingredients: [
      '500g burtă de vită',
      '2 morcovi',
      '1 țelină mică',
      '1 ardei gras',
      '200ml smântână',
      '2 gălbenușuri',
      'oțet, sare, piper',
    ],
    imageUrl: '/images/meals/ciorba-burta.jpg',
  },
  dinner: {
    id: '3',
    name: 'Sarmale cu mămăligă',
    type: 'dinner',
    calories: 580,
    protein: 32,
    carbs: 45,
    fat: 28,
    prepTime: 60,
    cookTime: 180,
    servings: 6,
    ingredients: [
      '500g carne tocată mixtă',
      '1 varză murată mare',
      '100g orez',
      '2 cepe mari',
      '400g bulion',
      'boia, cimbru, sare, piper',
    ],
    imageUrl: '/images/meals/sarmale.jpg',
  },
};

const baseUrl = '/api/meals';

// Success handlers
function getMeals() {
  return http.get(baseUrl, async () => {
    await delay(500);
    return HttpResponse.json({
      status: 'ok',
      data: Object.values(mockMeals),
    });
  });
}

function getMealById(id: string = '1') {
  return http.get(`${baseUrl}/:id`, async ({ params }) => {
    await delay(300);
    const mealId = params.id || id;
    const meal = Object.values(mockMeals).find((m) => m.id === mealId);

    if (!meal) {
      return HttpResponse.json({ status: 'error', message: 'Meal not found' }, { status: 404 });
    }

    return HttpResponse.json({
      status: 'ok',
      data: meal,
    });
  });
}

// Loading state
function slowMeals(ms: number = 2000) {
  return http.get(baseUrl, async () => {
    await delay(ms);
    return HttpResponse.json({
      status: 'ok',
      data: Object.values(mockMeals),
    });
  });
}

// Empty state
function emptyMeals() {
  return http.get(baseUrl, async () => {
    await delay(200);
    return HttpResponse.json({
      status: 'ok',
      data: [],
      message: 'Nu ai încă mese planificate',
    });
  });
}

// Error states
function serverError() {
  return http.get(baseUrl, async () => {
    await delay(400);
    return HttpResponse.json({ status: 'error', message: 'Eroare de server' }, { status: 500 });
  });
}

function unauthorized() {
  return http.get(baseUrl, async () => {
    await delay(200);
    return HttpResponse.json(
      { status: 'error', message: 'Trebuie să fii autentificat' },
      { status: 401 }
    );
  });
}

// Export grouped handlers
export const mealHandlers = {
  getMeals,
  getMealById,
  slowMeals,
  emptyMeals,
  serverError,
  unauthorized,
};

// Default handlers for global setup
export const defaultMealHandlers = [mealHandlers.getMeals(), mealHandlers.getMealById()];
