// Translation files exports

// Romanian translations
export { default as roCommon } from './ro/common.json';
export { default as roAuth } from './ro/auth.json';
export { default as roMeals } from './ro/meals.json';
export { default as roShopping } from './ro/shopping.json';
export { default as roAdmin } from './ro/admin.json';
export { default as roRecipes } from './ro/recipes.json';
export { default as roSettings } from './ro/settings.json';
export { default as roLanding } from './ro/landing.json';

// English translations (empty placeholders for future)
export { default as enCommon } from './en/common.json';
export { default as enAuth } from './en/auth.json';
export { default as enMeals } from './en/meals.json';
export { default as enShopping } from './en/shopping.json';
export { default as enAdmin } from './en/admin.json';
export { default as enRecipes } from './en/recipes.json';
export { default as enSettings } from './en/settings.json';
export { default as enLanding } from './en/landing.json';

// Resource configuration for i18next
export const resources = {
  ro: {
    common: () => import('./ro/common.json'),
    auth: () => import('./ro/auth.json'),
    meals: () => import('./ro/meals.json'),
    shopping: () => import('./ro/shopping.json'),
    admin: () => import('./ro/admin.json'),
    recipes: () => import('./ro/recipes.json'),
    settings: () => import('./ro/settings.json'),
    landing: () => import('./ro/landing.json'),
  },
  en: {
    common: () => import('./en/common.json'),
    auth: () => import('./en/auth.json'),
    meals: () => import('./en/meals.json'),
    shopping: () => import('./en/shopping.json'),
    admin: () => import('./en/admin.json'),
    recipes: () => import('./en/recipes.json'),
    settings: () => import('./en/settings.json'),
    landing: () => import('./en/landing.json'),
  },
};
