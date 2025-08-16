import type { CoreMessage } from 'ai';

export interface RecipeData {
  id?: string;
  title: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  dietaryRestrictions?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
}

export interface MealPlanData {
  startDate: string;
  endDate: string;
  targetCalories?: number;
  dietaryPreferences?: string[];
  excludeIngredients?: string[];
  mealsPerDay?: number;
  familySize?: number;
}

/**
 * Creates a system prompt for the recipe assistant
 */
export function createRecipeAssistantPrompt(language: 'ro' | 'en' = 'ro'): string {
  const prompts = {
    ro: `Ești un asistent culinar expert specializat în bucătăria românească și internațională.
    
Responsabilitățile tale:
- Oferă sfaturi despre rețete și tehnici de gătit
- Sugerează substituții pentru ingrediente
- Ajută cu planificarea meselor
- Explică tehnici culinare
- Oferă informații nutriționale când sunt solicitate

Linii directoare:
- Răspunde întotdeauna în limba română
- Fii prietenos și încurajator
- Oferă răspunsuri clare și concise
- Include măsurători metrice (grame, mililitri)
- Adaptează sfaturile pentru bucătăria românească când este relevant
- Ia în considerare disponibilitatea ingredientelor în România
- Respectă restricțiile dietetice menționate

Nu oferi sfaturi medicale sau de sănătate dincolo de informații nutriționale generale.`,

    en: `You are an expert culinary assistant specializing in Romanian and international cuisine.

Your responsibilities:
- Provide advice on recipes and cooking techniques
- Suggest ingredient substitutions
- Help with meal planning
- Explain culinary techniques
- Provide nutritional information when requested

Guidelines:
- Always respond in English unless requested otherwise
- Be friendly and encouraging
- Provide clear and concise answers
- Include metric measurements (grams, milliliters)
- Adapt advice for Romanian cuisine when relevant
- Consider ingredient availability in Romania
- Respect mentioned dietary restrictions

Do not provide medical or health advice beyond general nutritional information.`,
  };

  return prompts[language];
}

/**
 * Creates a prompt for recipe validation
 */
export function createRecipeValidationPrompt(
  recipe: RecipeData,
  language: 'ro' | 'en' = 'ro'
): CoreMessage[] {
  const systemPrompt =
    language === 'ro'
      ? `Ești un expert culinar care validează rețete pentru acuratețe, completitudine și fezabilitate.
       Analizează rețeta și oferă feedback despre:
       1. Claritatea instrucțiunilor
       2. Proporțiile ingredientelor
       3. Timpii de preparare realiști
       4. Potențiale probleme sau îmbunătățiri
       5. Informații nutriționale estimate`
      : `You are a culinary expert validating recipes for accuracy, completeness, and feasibility.
       Analyze the recipe and provide feedback on:
       1. Instruction clarity
       2. Ingredient proportions
       3. Realistic preparation times
       4. Potential issues or improvements
       5. Estimated nutritional information`;

  const userPrompt =
    language === 'ro'
      ? `Te rog validează această rețetă:
       
       Titlu: ${recipe.title}
       ${recipe.description ? `Descriere: ${recipe.description}` : ''}
       ${recipe.ingredients ? `Ingrediente: ${recipe.ingredients.join(', ')}` : ''}
       ${recipe.instructions ? `Instrucțiuni: ${recipe.instructions.join(' ')}` : ''}
       ${recipe.prepTime ? `Timp preparare: ${recipe.prepTime} minute` : ''}
       ${recipe.cookTime ? `Timp gătire: ${recipe.cookTime} minute` : ''}
       ${recipe.servings ? `Porții: ${recipe.servings}` : ''}
       ${recipe.difficulty ? `Dificultate: ${recipe.difficulty}` : ''}`
      : `Please validate this recipe:
       
       Title: ${recipe.title}
       ${recipe.description ? `Description: ${recipe.description}` : ''}
       ${recipe.ingredients ? `Ingredients: ${recipe.ingredients.join(', ')}` : ''}
       ${recipe.instructions ? `Instructions: ${recipe.instructions.join(' ')}` : ''}
       ${recipe.prepTime ? `Prep time: ${recipe.prepTime} minutes` : ''}
       ${recipe.cookTime ? `Cook time: ${recipe.cookTime} minutes` : ''}
       ${recipe.servings ? `Servings: ${recipe.servings}` : ''}
       ${recipe.difficulty ? `Difficulty: ${recipe.difficulty}` : ''}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Creates a prompt for recipe generation
 */
export function createRecipeGenerationPrompt(
  requirements: {
    cuisine?: string;
    mainIngredients?: string[];
    dietaryRestrictions?: string[];
    difficulty?: string;
    maxPrepTime?: number;
    servings?: number;
  },
  language: 'ro' | 'en' = 'ro'
): CoreMessage[] {
  const systemPrompt =
    language === 'ro'
      ? `Ești un chef expert care creează rețete personalizate. 
       Creează rețete complete cu:
       - Titlu atractiv
       - Descriere apetisantă
       - Listă completă de ingrediente cu cantități
       - Instrucțiuni pas cu pas clare
       - Timpuri de preparare realiste
       - Informații nutriționale estimate
       - Sfaturi utile pentru reușită`
      : `You are an expert chef creating personalized recipes.
       Create complete recipes with:
       - Attractive title
       - Appetizing description
       - Complete ingredient list with quantities
       - Clear step-by-step instructions
       - Realistic preparation times
       - Estimated nutritional information
       - Helpful tips for success`;

  const constraints = [];
  if (requirements.cuisine) {
    constraints.push(
      language === 'ro' ? `Bucătărie: ${requirements.cuisine}` : `Cuisine: ${requirements.cuisine}`
    );
  }
  if (requirements.mainIngredients?.length) {
    constraints.push(
      language === 'ro'
        ? `Ingrediente principale: ${requirements.mainIngredients.join(', ')}`
        : `Main ingredients: ${requirements.mainIngredients.join(', ')}`
    );
  }
  if (requirements.dietaryRestrictions?.length) {
    constraints.push(
      language === 'ro'
        ? `Restricții dietetice: ${requirements.dietaryRestrictions.join(', ')}`
        : `Dietary restrictions: ${requirements.dietaryRestrictions.join(', ')}`
    );
  }
  if (requirements.difficulty) {
    constraints.push(
      language === 'ro'
        ? `Dificultate: ${requirements.difficulty}`
        : `Difficulty: ${requirements.difficulty}`
    );
  }
  if (requirements.maxPrepTime) {
    constraints.push(
      language === 'ro'
        ? `Timp maxim total: ${requirements.maxPrepTime} minute`
        : `Maximum total time: ${requirements.maxPrepTime} minutes`
    );
  }
  if (requirements.servings) {
    constraints.push(
      language === 'ro' ? `Porții: ${requirements.servings}` : `Servings: ${requirements.servings}`
    );
  }

  const userPrompt =
    language === 'ro'
      ? `Creează o rețetă cu următoarele cerințe:\n${constraints.join('\n')}`
      : `Create a recipe with the following requirements:\n${constraints.join('\n')}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Creates a prompt for meal planning
 */
export function createMealPlanningPrompt(
  planData: MealPlanData,
  language: 'ro' | 'en' = 'ro'
): CoreMessage[] {
  const systemPrompt =
    language === 'ro'
      ? `Ești un nutriționist expert care creează planuri de masă echilibrate și personalizate.
       Creează planuri care:
       - Respectă preferințele și restricțiile dietetice
       - Oferă varietate și echilibru nutrițional
       - Includ rețete practice și accesibile
       - Optimizează lista de cumpărături
       - Sunt adaptate pentru bucătăria românească`
      : `You are an expert nutritionist creating balanced and personalized meal plans.
       Create plans that:
       - Respect dietary preferences and restrictions
       - Provide variety and nutritional balance
       - Include practical and accessible recipes
       - Optimize shopping lists
       - Are adapted for Romanian cuisine`;

  const details = [];
  details.push(
    language === 'ro'
      ? `Perioada: ${planData.startDate} - ${planData.endDate}`
      : `Period: ${planData.startDate} - ${planData.endDate}`
  );

  if (planData.targetCalories) {
    details.push(
      language === 'ro'
        ? `Calorii țintă pe zi: ${planData.targetCalories}`
        : `Target calories per day: ${planData.targetCalories}`
    );
  }
  if (planData.dietaryPreferences?.length) {
    details.push(
      language === 'ro'
        ? `Preferințe dietetice: ${planData.dietaryPreferences.join(', ')}`
        : `Dietary preferences: ${planData.dietaryPreferences.join(', ')}`
    );
  }
  if (planData.excludeIngredients?.length) {
    details.push(
      language === 'ro'
        ? `Exclude ingrediente: ${planData.excludeIngredients.join(', ')}`
        : `Exclude ingredients: ${planData.excludeIngredients.join(', ')}`
    );
  }
  if (planData.mealsPerDay) {
    details.push(
      language === 'ro'
        ? `Mese pe zi: ${planData.mealsPerDay}`
        : `Meals per day: ${planData.mealsPerDay}`
    );
  }
  if (planData.familySize) {
    details.push(
      language === 'ro'
        ? `Număr persoane: ${planData.familySize}`
        : `Family size: ${planData.familySize}`
    );
  }

  const userPrompt =
    language === 'ro'
      ? `Creează un plan de masă cu următoarele detalii:\n${details.join('\n')}`
      : `Create a meal plan with the following details:\n${details.join('\n')}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Creates a prompt for ingredient substitution suggestions
 */
export function createSubstitutionPrompt(
  ingredient: string,
  context?: string,
  language: 'ro' | 'en' = 'ro'
): CoreMessage[] {
  const systemPrompt =
    language === 'ro'
      ? `Ești un expert culinar specializat în substituții de ingrediente.
       Oferă alternative practice considerând:
       - Disponibilitatea în România
       - Similaritate în gust și textură
       - Proporții de înlocuire
       - Impact asupra rezultatului final
       - Opțiuni pentru diferite restricții dietetice`
      : `You are a culinary expert specialized in ingredient substitutions.
       Provide practical alternatives considering:
       - Availability in Romania
       - Similarity in taste and texture
       - Replacement proportions
       - Impact on final result
       - Options for different dietary restrictions`;

  const userPrompt =
    language === 'ro'
      ? `Cu ce pot înlocui ${ingredient}${context ? ` în ${context}` : ''}?`
      : `What can I substitute for ${ingredient}${context ? ` in ${context}` : ''}?`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Creates a prompt for cooking technique explanation
 */
export function createTechniqueExplanationPrompt(
  technique: string,
  language: 'ro' | 'en' = 'ro'
): CoreMessage[] {
  const systemPrompt =
    language === 'ro'
      ? `Ești un instructor culinar expert care explică tehnici de gătit.
       Oferă explicații clare despre:
       - Ce este tehnica și când se folosește
       - Pași detaliate pentru executare
       - Greșeli comune de evitat
       - Sfaturi pentru reușită
       - Echipamente necesare`
      : `You are an expert culinary instructor explaining cooking techniques.
       Provide clear explanations about:
       - What the technique is and when to use it
       - Detailed steps for execution
       - Common mistakes to avoid
       - Tips for success
       - Required equipment`;

  const userPrompt =
    language === 'ro'
      ? `Explică tehnica de gătit: ${technique}`
      : `Explain the cooking technique: ${technique}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Creates a prompt for nutritional analysis
 */
export function createNutritionalAnalysisPrompt(
  foodItem: string | RecipeData,
  servingSize?: string,
  language: 'ro' | 'en' = 'ro'
): CoreMessage[] {
  const systemPrompt =
    language === 'ro'
      ? `Ești un nutriționist care oferă analize nutriționale detaliate.
       Oferă informații despre:
       - Calorii și macronutrienți (proteine, carbohidrați, grăsimi)
       - Fibre și zaharuri
       - Vitamine și minerale principale
       - Beneficii pentru sănătate
       - Considerații pentru diferite diete
       Notă: Oferă doar informații nutriționale generale, nu sfaturi medicale.`
      : `You are a nutritionist providing detailed nutritional analyses.
       Provide information about:
       - Calories and macronutrients (protein, carbohydrates, fats)
       - Fiber and sugars
       - Main vitamins and minerals
       - Health benefits
       - Considerations for different diets
       Note: Provide only general nutritional information, not medical advice.`;

  let itemDescription = '';
  if (typeof foodItem === 'string') {
    itemDescription = foodItem;
  } else {
    itemDescription =
      language === 'ro'
        ? `Rețetă: ${foodItem.title}${foodItem.ingredients ? `\nIngrediente: ${foodItem.ingredients.join(', ')}` : ''}`
        : `Recipe: ${foodItem.title}${foodItem.ingredients ? `\nIngredients: ${foodItem.ingredients.join(', ')}` : ''}`;
  }

  const userPrompt =
    language === 'ro'
      ? `Analizează nutrițional: ${itemDescription}${servingSize ? `\nPorție: ${servingSize}` : ''}`
      : `Nutritionally analyze: ${itemDescription}${servingSize ? `\nServing size: ${servingSize}` : ''}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Helper function to format messages for the AI SDK
 */
export function formatMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages.map((msg) => ({
    ...msg,
    content: typeof msg.content === 'string' ? msg.content.trim() : msg.content,
  })) as CoreMessage[];
}
