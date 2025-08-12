# WebSocket Events (Real-time Updates)

```typescript
// Real-time events for admin dashboard
interface AdminEvents {
  'meal-plan:auto-saved': { draftId: string; timestamp: Date };
  'validation:completed': { draftId: string; results: ValidationResult[] };
  'publishing:scheduled': { weekNumber: number; scheduledFor: Date };
  'import:progress': { importId: string; processed: number; total: number };
}

// User events for optimistic updates
interface UserEvents {
  'meal:marked-cooked': { weekNumber: number; dayOfWeek: string; mealType: string };
  'shopping-item:updated': { itemId: string; isChecked: boolean };
  'plan:published': { weekNumber: number; availableAt: Date };
}
```
