# Account Settings View

## Layout Structure

```
┌─────────────────────────────────────┐
│ ← Settings                          │
├─────────────────────────────────────┤
│                                     │
│ Profile                             │
│ ┌───────────────────────────────┐   │
│ │ [Avatar] Name                 │   │
│ │          email@example.com    │   │
│ │          [Edit Profile]       │   │
│ └───────────────────────────────┘   │
│                                     │
│ Preferences                         │
│ ┌───────────────────────────────┐   │
│ │ Default View    [Week ▼]      │   │
│ │ Notifications   [Toggle]      │   │
│ │ Language        [Română ▼]    │   │
│ └───────────────────────────────┘   │
│                                     │
│ Subscription                        │
│ ┌───────────────────────────────┐   │
│ │ Plan: Monthly (50 RON)        │   │
│ │ Next billing: 15 Dec 2024     │   │
│ │ [Manage Subscription]         │   │
│ └───────────────────────────────┘   │
│                                     │
│ Support                             │
│ ┌───────────────────────────────┐   │
│ │ [Contact Support]             │   │
│ │ [FAQ]                         │   │
│ │ [Terms & Privacy]            │   │
│ └───────────────────────────────┘   │
│                                     │
│ [Sign Out]                          │
│                                     │
└─────────────────────────────────────┘
```

## Interaction Patterns

- Each section card is tappable
- Settings save automatically (no save button)
- Confirmation for destructive actions (sign out, cancel subscription)
- Loading states for async operations

- Monorepo structure needed for admin separation?
- Real-time features approach for shopping list sync?
