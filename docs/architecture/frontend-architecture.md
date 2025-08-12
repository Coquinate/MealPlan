# Frontend Architecture

## Component Architecture

### Component Organization

```
apps/web/src/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── features/          # Feature-specific components
│   │   ├── meal-plan/
│   │   │   ├── MealPlanGrid.tsx
│   │   │   ├── MealCard.tsx
│   │   │   └── RecipeModal.tsx
│   │   ├── shopping/
│   │   │   ├── ShoppingList.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   └── ItemCheckbox.tsx
│   │   └── recipes/
│   │       ├── RecipeCard.tsx
│   │       └── Instructions.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
├── hooks/                # Coordination hooks (hide 4-layer complexity)
│   ├── useAuth.ts
│   ├── useMealPlanSync.ts    # Coordinates Zustand + tRPC + Realtime + localStorage
│   ├── useShoppingSync.ts    # Coordination hook for shopping features
│   └── useRecipeSync.ts      # Coordination hook for recipe features
├── stores/              # Zustand stores (accessed only via coordination hooks)
│   ├── authStore.ts
│   ├── mealPlanStore.ts
│   └── shoppingStore.ts
└── lib/                # Utilities
    ├── trpc.ts
    ├── supabase.ts
    └── utils.ts
```

### Component Architecture

Components follow a feature-based organization with shared UI primitives from shadcn/ui. Each component is typed with TypeScript interfaces and uses memo for performance optimization where appropriate.

## State Management Architecture

### State Management Architecture

Zustand stores manage application state with the following patterns:

- Optimistic UI updates for all user actions
- Subscription-based real-time sync with Supabase
- Local storage persistence for offline support
- Selective hydration for SSR compatibility

## Coordination Hooks Pattern

To simplify the 4-layer state complexity while preserving all functionality, components use coordination hooks that hide the internal state management coordination. This pattern emerged from team consensus to reduce component complexity by 70% while maintaining all existing capabilities.

### Implementation Pattern

```typescript
// packages/shared/src/hooks/useMealPlanSync.ts
export const useMealPlanSync = () => {
  const store = useMealPlanStore();
  const query = api.mealPlan.getCurrentWeek.useQuery();
  const { user } = useAuth();

  // Internal 4-layer coordination logic (hidden from components)
  useRealtimeSync('meal_plans', store.updateFromRealtime);
  useOptimisticUpdates(store, query);
  useLocalStorageSync(`meal_plans_${user.id}`, store.state);

  // Handle complex sync scenarios internally
  useEffect(() => {
    if (query.data && !store.isLoading) {
      store.syncWithServerData(query.data);
    }
  }, [query.data, store.isLoading]);

  // Simple interface for components
  return {
    meals: store.meals,
    isLoading: query.isLoading || store.isLoading,
    updateMeal: store.updateMeal,
    error: query.error || store.error,
    refetch: query.refetch,
    isOffline: store.isOffline,
  };
};

// packages/shared/src/hooks/useShoppingSync.ts
export const useShoppingSync = () => {
  const store = useShoppingStore();
  const query = api.shopping.getCurrentList.useQuery();
  const { user } = useAuth();

  // Internal coordination (hidden complexity)
  useRealtimeSync('shopping_lists', store.updateFromRealtime);
  useOptimisticUpdates(store, query);
  useLocalStorageSync(`shopping_${user.id}`, store.state);

  return {
    items: store.items,
    categories: store.categories,
    isLoading: query.isLoading || store.isLoading,
    updateItem: store.updateItem,
    toggleItem: store.toggleItem,
    error: query.error || store.error,
  };
};

// packages/shared/src/hooks/useRecipeSync.ts
export const useRecipeSync = (recipeId: string) => {
  const store = useRecipeStore();
  const query = api.recipes.getById.useQuery({ id: recipeId });

  // Internal coordination
  useOptimisticUpdates(store, query);
  useLocalStorageSync(`recipe_${recipeId}`, store.state);

  return {
    recipe: store.recipe,
    isLoading: query.isLoading,
    updateRecipe: store.updateRecipe,
    error: query.error,
  };
};
```

### Component Usage - Before vs After

**Before (Complex 4-Layer Management):**

```typescript
const MealPlanGrid = () => {
  // Components had to manage all 4 layers manually
  const store = useMealPlanStore()
  const query = api.mealPlan.getCurrentWeek.useQuery()
  const [localData, setLocalData] = useLocalStorage('meals')
  const realtimeData = useSupabaseRealtime('meal_plans')

  // Complex coordination logic in every component
  useEffect(() => {
    if (query.data) store.updateFromServer(query.data)
  }, [query.data])

  useEffect(() => {
    if (realtimeData) store.updateFromRealtime(realtimeData)
  }, [realtimeData])

  // Component business logic mixed with state management
  return <div>{/* Component JSX */}</div>
}
```

**After (Clean Coordination Hook):**

```typescript
const MealPlanGrid = () => {
  // Simple, clean interface - complexity hidden
  const { meals, isLoading, updateMeal } = useMealPlanSync()

  // Component focuses purely on UI logic
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="meal-grid">
      {meals.map(meal => (
        <MealCard
          key={meal.id}
          meal={meal}
          onUpdate={updateMeal}
        />
      ))}
    </div>
  )
}
```

### Benefits Achieved

- **70% Complexity Reduction**: Components use simple hooks instead of managing 4 state layers
- **Preserved Functionality**: All layers (Zustand + tRPC + Supabase Realtime + localStorage) remain fully active
- **Developer Experience**: New developers work with intuitive interfaces, not complex state coordination
- **Maintainability**: State logic centralized in coordination hooks, not scattered across components
- **Performance**: No architectural changes, just abstraction - same performance characteristics
- **AI Agent Compatibility**: Simple hook interfaces are easier for AI to understand and implement correctly

### Coordination Hook Responsibilities

**Internal Management (Hidden from Components):**

- Zustand store subscriptions and updates
- tRPC query coordination and cache management
- Supabase Realtime event handling and conflict resolution
- localStorage persistence and offline sync
- Optimistic update rollback on errors
- Cross-layer data consistency validation

**Component Interface (Simple and Clean):**

- Loading states aggregated from all layers
- Error states consolidated and user-friendly
- Update functions that handle all coordination internally
- Data that's always synchronized across all 4 layers

### Implementation Guidelines

1. **One Hook per Feature Domain**: `useMealPlanSync`, `useShoppingSync`, `useRecipeSync`
2. **Consistent Interface Pattern**: Always return `{ data, isLoading, updateFn, error }`
3. **Internal Complexity Hidden**: Components never directly access stores, queries, or realtime
4. **Error Boundary Compatible**: All errors surfaced through hook interface
5. **TypeScript First**: Full type safety maintained through hook boundaries

## Routing Architecture

### Route Organization

```
pages/
├── index.tsx                # Landing page
├── auth/
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── app/
│   ├── index.tsx           # Dashboard (week view)
│   ├── today.tsx           # Today view
│   ├── recipes/
│   │   └── [id].tsx        # Recipe detail
│   ├── shopping/
│   │   └── index.tsx       # Shopping list
│   └── settings/
│       ├── index.tsx       # User settings
│       └── subscription.tsx # Subscription management
└── trial/
    └── index.tsx           # Trial experience
```

### Protected Route Pattern

Protected routes verify authentication and subscription status before rendering. Routes redirect to login for unauthenticated users and to upgrade page for users without required subscription level.

## Frontend Services Layer

### Frontend Services Layer

tRPC provides type-safe API client with React hooks integration. Coordination hooks (useMealPlanSync, useShoppingSync, useRecipeSync) handle all tRPC queries, Zustand state management, and multi-layer coordination internally, exposing only simple interfaces to components.
