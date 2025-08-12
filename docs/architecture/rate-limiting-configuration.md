# Rate Limiting Configuration

```typescript
// Rate limits per endpoint category
export const rateLimits = {
  auth: { requests: 5, window: '15m' },
  mealPlan: { requests: 100, window: '15m' },
  shopping: { requests: 50, window: '15m' },
  subscription: { requests: 20, window: '15m' },
  admin: { requests: 200, window: '15m' },
  aiGeneration: { requests: 10, window: '1h' }, // Expensive AI operations
} as const;
```
