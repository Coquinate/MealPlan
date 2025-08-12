# tRPC Router Definitions

Our API follows tRPC v11.4.3 patterns for complete type safety between frontend and backend:

## User Authentication Router

```typescript
import { z } from 'zod';
import { publicProcedure, protectedProcedure, createTRPCRouter } from '@/server/trpc';

export const authRouter = createTRPCRouter({
  // User registration (Epic 1)
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        householdSize: z.number().int().min(1).max(6), // FR5
        menuType: z.enum(['omnivore', 'vegetarian']), // FR4
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Registration logic with trial setup per FR8
      return { user, trialMenu };
    }),

  // User login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Authentication logic
      return { user, session };
    }),

  // Get current user session
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Update user preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        householdSize: z.number().int().min(1).max(6).optional(),
        menuType: z.enum(['omnivore', 'vegetarian']).optional(),
        defaultViewPreference: z.enum(['week', 'today']).optional(), // FR32
        guestModeEnabled: z.boolean().optional(), // FR40: Guest mode toggle
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Update user preferences
      return updatedUser;
    }),
});
```

## Meal Plan Router

```typescript
export const mealPlanRouter = createTRPCRouter({
  // Get current week's meal plan (Epic 4)
  getCurrentWeek: protectedProcedure.query(async ({ ctx }) => {
    // Returns current week's published meal plan
    // Supports both omnivore/vegetarian per FR27
    return { weekNumber, meals, recipes, shoppingList };
  }),

  // Get previous week (3-day visibility per FR10)
  getPreviousWeek: protectedProcedure
    .input(
      z.object({
        weekNumber: z.number().int(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Returns previous week if within 3-day window
      return { meals, recipes } | null;
    }),

  // Get trial menu (FR8, FR29)
  getTrialMenu: publicProcedure.query(async () => {
    // Returns fixed 3-day showcase menu
    return { day1Meals, day2Meals, day3Meals };
  }),

  // Get today's meals with nutritional info (FR41)
  getTodayMeals: protectedProcedure.query(async ({ ctx }) => {
    // Returns today's meals with full nutritional information
    // Implements FR41: nutritional info display on Today Focus view
    return {
      todayMeals: meals.map((meal) => ({
        ...meal,
        recipe: {
          ...meal.recipe,
          nutritionalInfo: meal.recipe.nutritionalData, // FR41: Required for Today Focus
        },
      })),
    };
  }),

  // Mark meal as cooked (FR7)
  markMealCooked: protectedProcedure
    .input(
      z.object({
        weekNumber: z.number().int(),
        dayOfWeek: z.enum([
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]),
        mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Mark meal as cooked with optimistic UI per FR37
      return { success: true };
    }),

  // Submit meal feedback (FR7)
  submitFeedback: protectedProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
        rating: z.enum(['liked', 'disliked']), // Matches DB constraint
        weekNumber: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Save user feedback for analytics
      return { success: true };
    }),
});
```

## Recipe Router

```typescript
export const recipeRouter = createTRPCRouter({
  // Get recipe details (FR9)
  getRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        householdSize: z.number().int().min(1).max(6).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Returns recipe with auto-scaled portions per FR5
      return {
        recipe,
        scaledIngredients,
        instructions,
        cookingTime,
        difficulty,
      };
    }),

  // Search recipes (admin feature)
  searchRecipes: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        menuType: z.enum(['omnivore', 'vegetarian']).optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        maxCookingTime: z.number().int().optional(),
        limit: z.number().int().default(20),
        offset: z.number().int().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return { recipes, totalCount };
    }),
});
```

## Shopping List Router

```typescript
export const shoppingListRouter = createTRPCRouter({
  // Get shopping list for current week (FR6, FR28)
  getCurrentShoppingList: protectedProcedure.query(async ({ ctx }) => {
    // Auto-generated from current week's recipes
    const shoppingList = {
      categories,
      items,
      customCategories: ctx.user.customShoppingCategories,
      guestModeEnabled: ctx.user.guestModeEnabled, // FR40
      quantityAdjustmentReminder: ctx.user.guestModeEnabled
        ? 'Reminder: Please manually adjust quantities based on your actual guest count.'
        : undefined, // FR40: Guest mode reminder
    };
    return shoppingList;
  }),

  // Update shopping list item (FR12)
  updateItem: protectedProcedure
    .input(
      z.object({
        itemId: z.string().cuid(),
        isChecked: z.boolean().optional(),
        isAlreadyHave: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Update item status with optimistic UI
      return { success: true };
    }),

  // Export shopping list as PDF (FR6)
  exportPDF: protectedProcedure
    .input(
      z.object({
        weekNumber: z.number().int(),
        includeChecked: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Generate PDF and return download URL
      return { downloadUrl, expiresAt };
    }),

  // Email shopping list (FR6)
  emailShoppingList: protectedProcedure
    .input(
      z.object({
        weekNumber: z.number().int(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { success: true, sentAt: new Date() };
    }),

  // Update custom categories (FR28)
  updateCustomCategories: protectedProcedure
    .input(
      z.object({
        categories: z.array(
          z.object({
            name: z.string(),
            order: z.number().int(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { updatedCategories };
    }),
});
```

## Subscription Router

```typescript
export const subscriptionRouter = createTRPCRouter({
  // Get subscription status (FR18-FR27)
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return {
      status: ctx.user.subscriptionStatus,
      currentPeriodEnd,
      pausedUntil: ctx.user.subscriptionPausedUntil,
      trialEndsAt: ctx.user.trialEndsAt,
    };
  }),

  // Create checkout session (FR18, FR23)
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planType: z.enum(['monthly', 'annual']),
        paymentMethod: z.enum(['card', 'paypal']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create Stripe checkout session
      return { checkoutUrl, sessionId };
    }),

  // Pause subscription (FR19)
  pauseSubscription: protectedProcedure
    .input(
      z.object({
        weeks: z.number().int().min(1).max(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { pausedUntil, resumesAt };
    }),

  // Cancel subscription (FR20)
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { cancelledAt, accessUntil };
    }),

  // Request refund (FR21)
  requestRefund: protectedProcedure
    .input(
      z.object({
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { refundRequestId, eligibleAmount };
    }),
});
```

## Admin Router (Epic 3)

```typescript
export const adminRouter = createTRPCRouter({
  // Admin authentication
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        totpCode: z.string().length(6), // 2FA per Story 3.1
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { adminUser, session };
    }),

  // Recipe management (Story 3.2)
  createRecipe: adminProtectedProcedure
    .input(
      z.object({
        name_ro: z.string(),
        name_en: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.number(),
            unit: z.string(),
          })
        ),
        instructions: z.array(z.string()),
        cookingTime: z.number().int(),
        activeCookingTime: z.number().int().min(1).max(180), // FR15: Active cooking time
        difficulty: z.enum(['easy', 'medium', 'hard']),
        menuType: z.enum(['omnivore', 'vegetarian']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // FR15: Validate weekday dinner cooking time
      if (input.activeCookingTime > 30) {
        // Flag recipe for validation if intended for weekday dinners
        await validateWeekdayDinnerTime(input);
      }
      return { recipe };
    }),

  // Recipe testing (Story 3.3) - FIXED with auto-population
  updateRecipeStatus: adminProtectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: z.enum(['draft', 'testing', 'approved', 'rejected']),
        testNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // AUTO-SET: testedBy = ctx.adminUser.id, testedAt = new Date()
      const updatedRecipe = await updateRecipe({
        id: input.id,
        status: input.status,
        testNotes: input.testNotes,
        testedBy: ctx.adminUser.id, // Auto-populated from session
        testedAt: new Date(), // Auto-populated timestamp
      });
      return { updatedRecipe };
    }),

  // Meal plan builder (Story 3.4, 3.5)
  createDraftMealPlan: adminProtectedProcedure
    .input(
      z.object({
        weekNumber: z.number().int(),
        menuType: z.enum(['omnivore', 'vegetarian']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { draftMealPlan };
    }),

  updateDraftMeal: adminProtectedProcedure
    .input(
      z.object({
        draftId: z.string().cuid(),
        dayOfWeek: z.enum([
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]),
        mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
        recipeId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Auto-save per NFR13
      return { updatedDraft };
    }),

  // AI validation (Story 3.6, 3.13)
  validateMealPlan: adminProtectedProcedure
    .input(
      z.object({
        draftId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // AI validation via Gemini per FR30
      return { validationResults };
    }),

  // Shopping list calculation (Story 3.7)
  calculateShoppingList: adminProtectedProcedure
    .input(
      z.object({
        draftId: z.string().cuid(),
        householdSize: z.number().int().min(1).max(6).default(4),
      })
    )
    .query(async ({ input, ctx }) => {
      return { shoppingList, totalItems };
    }),

  // Publishing (Story 3.8)
  publishMealPlan: adminProtectedProcedure
    .input(
      z.object({
        draftId: z.string().cuid(),
        scheduledFor: z.date(), // Thursday 6 AM per FR3
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { publishedWeek };
    }),

  // Analytics (Story 3.10)
  getAnalytics: adminProtectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      return {
        userMetrics,
        recipePerformance,
        subscriptionStats,
        feedbackSummary,
      };
    }),

  // AI recipe generation (Story 3.11)
  generateRecipe: adminProtectedProcedure
    .input(
      z.object({
        ingredients: z.array(z.string()),
        cuisine: z.string().optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        maxCookingTime: z.number().int().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // AI generation via Gemini
      return { generatedRecipe };
    }),

  // AI meal plan generation (Story 3.12)
  generateMealPlan: adminProtectedProcedure
    .input(
      z.object({
        weekNumber: z.number().int(),
        menuType: z.enum(['omnivore', 'vegetarian']),
        preferences: z
          .object({
            focusIngredients: z.array(z.string()).optional(),
            avoidIngredients: z.array(z.string()).optional(),
            maxCookingTime: z.number().int().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { generatedPlan };
    }),

  // Bulk import (FR31)
  importRecipes: adminProtectedProcedure
    .input(
      z.object({
        format: z.enum(['csv', 'json']),
        data: z.string(), // Base64 encoded file content
        source: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { importId, processedCount, errors };
    }),
});

// ADDED: Complete Trial System Router
export const trialRouter = createTRPCRouter({
  // Get user's trial status and gift access (FR8, FR29)
  getTrialStatus: protectedProcedure.query(async ({ ctx }) => {
    return {
      hasActiveTrial: ctx.user.hasActiveTrial,
      hasGiftAccess: ctx.user.hasTrialGiftAccess,
      trialExpiresAt: ctx.user.trialEndsAt,
      trialMenu: ctx.user.userTrial?.trialMenu,
      completedMeals: ctx.user.userTrial?.completedMeals || [],
    };
  }),

  // Mark trial meal as completed (FR8 experience)
  markTrialMealCompleted: protectedProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
        dayNumber: z.number().int().min(1).max(3),
        mealType: z.enum(['lunch', 'dinner', 'snacks']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Update UserTrial.completedMeals array
      return { success: true, newCompletionCount: completedCount };
    }),

  // Convert trial to paid subscription (FR26)
  convertToPaid: protectedProcedure
    .input(
      z.object({
        planType: z.enum(['monthly', 'annual']),
        paymentMethod: z.enum(['card', 'paypal']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Set UserTrial.convertedAt, grant immediate week access per FR26
      // Update User.subscriptionStatus, maintain gift access
      return {
        success: true,
        immediateAccessGranted: true,
        checkoutUrl,
        giftAccessRetained: true,
      };
    }),

  // Access forever gift recipes (FR8)
  getGiftRecipes: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.hasTrialGiftAccess) {
      throw new Error('No gift access available');
    }
    // Return trial recipes user has forever access to
    return { giftRecipes, permanentAccess: true };
  }),

  // Get trial completion progress
  getTrialProgress: protectedProcedure.query(async ({ ctx }) => {
    return {
      totalMeals: 9, // 3 days × 3 meals
      completedMeals: ctx.user.userTrial?.completedMeals.length || 0,
      daysRemaining: calculateDaysRemaining(ctx.user.trialEndsAt),
      completionRate: calculateCompletionRate(ctx.user.userTrial),
    };
  }),
});

// ADDED: Admin Trial Management Router
export const adminTrialRouter = createTRPCRouter({
  // Create/update trial menus (FR29)
  createTrialMenu: adminProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        meals: z
          .array(
            z.object({
              dayNumber: z.number().int().min(1).max(3),
              mealType: z.enum(['lunch', 'dinner', 'snacks']),
              recipeId: z.string().cuid(),
              displayOrder: z.number().int(),
            })
          )
          .length(9), // Exactly 9 meals required
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validate all recipes exist and are approved
      return { trialMenu, totalMeals: 9 };
    }),

  // Activate trial menu (only one active at a time)
  activateTrialMenu: adminProtectedProcedure
    .input(
      z.object({
        trialMenuId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Set TrialMenu.isActive = true, deactivate others
      return { success: true, activatedMenu: trialMenuId };
    }),

  // Get trial analytics
  getTrialAnalytics: adminProtectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      return {
        totalTrialUsers,
        conversionRate,
        averageCompletionRate,
        mostPopularRecipes,
        leastPopularRecipes,
        giftAccessUsers: usersWithGiftAccess,
      };
    }),

  // List all trial menus (active and inactive)
  listTrialMenus: adminProtectedProcedure.query(async ({ ctx }) => {
    return { trialMenus, activeMenuId };
  }),

  // Update existing trial menu
  updateTrialMenu: adminProtectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().optional(),
        description: z.string().optional(),
        meals: z
          .array(
            z.object({
              dayNumber: z.number().int().min(1).max(3),
              mealType: z.enum(['lunch', 'dinner', 'snacks']),
              recipeId: z.string().cuid(),
              displayOrder: z.number().int(),
            })
          )
          .length(9)
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return { updatedTrialMenu };
    }),
});
```
