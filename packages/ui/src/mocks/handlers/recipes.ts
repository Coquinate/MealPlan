import { http, HttpResponse, delay } from 'msw';

// Romanian recipe fixtures
export const mockRecipes = [
  {
    id: '1',
    name: 'Salată de vinete',
    category: 'aperitiv',
    difficulty: 'ușor',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    calories: 180,
    ingredients: [
      '3 vinete mari',
      '1 ceapă roșie',
      '3 linguri maioneză',
      '1 lingură ulei',
      'sare după gust',
    ],
    instructions: [
      'Coaceți vinetele pe grătar sau pe aragaz',
      'Lăsați să se răcească și curățați de coajă',
      'Tăiați mărunt cu un cuțit de lemn',
      'Adăugați ceapa tocată fin',
      'Amestecați cu maioneza și uleiul',
      'Asezonați cu sare',
    ],
    tags: ['vegetarian', 'tradițional', 'vară'],
    imageUrl: '/images/recipes/salata-vinete.jpg',
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Mici de casă',
    category: 'fel principal',
    difficulty: 'mediu',
    prepTime: 30,
    cookTime: 15,
    servings: 6,
    calories: 420,
    ingredients: [
      '500g carne vită',
      '500g carne porc',
      '4 căței usturoi',
      '1 linguriță bicarbonat',
      'cimbru, boia, sare, piper',
      '200ml supă de oase',
    ],
    instructions: [
      'Amestecați carnea tocată cu toate condimentele',
      'Adăugați treptat supa de oase',
      'Frământați bine timp de 10 minute',
      'Lăsați la frigider 2 ore',
      'Formați mici și grătăriți 6-7 minute pe fiecare parte',
    ],
    tags: ['grătar', 'tradițional', 'petrecere'],
    imageUrl: '/images/recipes/mici.jpg',
    rating: 4.9,
    reviews: 567,
  },
  {
    id: '3',
    name: 'Papanași',
    category: 'desert',
    difficulty: 'mediu',
    prepTime: 20,
    cookTime: 10,
    servings: 4,
    calories: 380,
    ingredients: [
      '500g brânză de vaci',
      '2 ouă',
      '4 linguri făină',
      '1 linguriță bicarbonat',
      '200g smântână',
      '200g dulceață de vișine',
    ],
    instructions: [
      'Amestecați brânza cu ouăle și făina',
      'Adăugați bicarbonatul și un praf de sare',
      'Formați gogoși cu gaură în mijloc',
      'Prăjiți în ulei încins până se rumenesc',
      'Serviți cu smântână și dulceață',
    ],
    tags: ['desert', 'tradițional', 'dulce'],
    imageUrl: '/images/recipes/papanasi.jpg',
    rating: 5.0,
    reviews: 892,
  },
];

const baseUrl = '/api/recipes';

// Success handlers
function getRecipes() {
  return http.get(baseUrl, async ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    await delay(500);

    let filtered = [...mockRecipes];

    if (category) {
      filtered = filtered.filter((r) => r.category === category);
    }

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.tags.some((t) => t.includes(search.toLowerCase()))
      );
    }

    return HttpResponse.json({
      status: 'ok',
      data: filtered,
      total: filtered.length,
    });
  });
}

function getRecipeById(id: string = '1') {
  return http.get(`${baseUrl}/:id`, async ({ params }) => {
    await delay(300);
    const recipeId = params.id || id;
    const recipe = mockRecipes.find((r) => r.id === recipeId);

    if (!recipe) {
      return HttpResponse.json(
        { status: 'error', message: 'Rețeta nu a fost găsită' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      status: 'ok',
      data: recipe,
    });
  });
}

// AI suggestions
function getAISuggestions() {
  return http.post(`${baseUrl}/ai-suggestions`, async ({ request }) => {
    const { preferences } = (await request.json()) as any;
    await delay(1500); // Simulate AI processing

    return HttpResponse.json({
      status: 'ok',
      data: {
        suggestions: mockRecipes.slice(0, 3),
        reasoning:
          'Am selectat aceste rețete bazat pe preferințele tale pentru mâncare tradițională românească, ținând cont de alergiile la nuci și lactate.',
      },
    });
  });
}

// Search states
function emptySearch() {
  return http.get(baseUrl, async () => {
    await delay(300);
    return HttpResponse.json({
      status: 'ok',
      data: [],
      message: 'Nu am găsit rețete care să corespundă căutării tale',
    });
  });
}

function slowSearch(ms: number = 3000) {
  return http.get(baseUrl, async () => {
    await delay(ms);
    return HttpResponse.json({
      status: 'ok',
      data: mockRecipes,
    });
  });
}

// Error states
function rateLimited() {
  return http.get(baseUrl, async () => {
    await delay(200);
    return HttpResponse.json(
      {
        status: 'error',
        message: 'Ai făcut prea multe căutări. Încearcă din nou în câteva minute.',
        retryAfter: 60,
      },
      { status: 429 }
    );
  });
}

// Export grouped handlers
export const recipeHandlers = {
  getRecipes,
  getRecipeById,
  getAISuggestions,
  emptySearch,
  slowSearch,
  rateLimited,
};

// Default handlers for global setup
export const defaultRecipeHandlers = [
  recipeHandlers.getRecipes(),
  recipeHandlers.getRecipeById(),
  recipeHandlers.getAISuggestions(),
];
