/**
 * MSW handlers index
 * Export all mock handlers for easy import in stories
 */

// Export all handler collections
export { subscribeHandlers, defaultSubscribeHandlers } from './subscribe';
export { mealHandlers, defaultMealHandlers } from './meals';
export { userHandlers, defaultUserHandlers } from './user';
export { recipeHandlers, defaultRecipeHandlers } from './recipes';

// Aggregate all default handlers for global MSW setup
import { defaultSubscribeHandlers } from './subscribe';
import { defaultMealHandlers } from './meals';
import { defaultUserHandlers } from './user';
import { defaultRecipeHandlers } from './recipes';

export const defaultHandlers = [
  ...defaultSubscribeHandlers,
  ...defaultMealHandlers,
  ...defaultUserHandlers,
  ...defaultRecipeHandlers,
];
