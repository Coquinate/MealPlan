# Additional Critical Wireframes

## Shopping List View (Mobile)

**Purpose:** Primary interface for grocery shopping with offline support

**Layout:**

```
┌─────────────────────────────┐
│ ← Shopping List        ⋮    │
├─────────────────────────────┤
│ 📅 15-21 January            │
│ 👥 2 people                 │
├─────────────────────────────┤
│ 🔍 Search ingredients...    │
├─────────────────────────────┤
│ PRODUCE                     │
│ □ 3x Onions                │
│ □ 500g Tomatoes            │
│ ✓ 2x Bell Peppers         │
│                            │
│ DAIRY                      │
│ □ 1L Milk                  │
│ □ 200g Cheese              │
│                            │
│ PANTRY                     │
│ ✓ Olive Oil               │
│ □ Salt                     │
├─────────────────────────────┤
│ ✓ 3/12 items              │
│ [Export PDF] [Email]       │
└─────────────────────────────┘
```

**Key Elements:**

- Search bar for quick finding
- Categories customizable by user
- Progress indicator at bottom
- Export options always visible
- Checked items move to bottom of category

## Recipe Detail View (Cooking Mode)

**Purpose:** Optimized for cooking with dirty hands

**Layout:**

```
┌─────────────────────────────┐
│ ← Back to Week              │
├─────────────────────────────┤
│ [=========== Recipe Image ] │
│                             │
│ CHICKEN PAPRIKASH          │
│ ⏱️ 30 min  👥 2 servings    │
├─────────────────────────────┤
│ INGREDIENTS                 │
│ • 500g chicken thighs      │
│ • 2 onions                 │
│ • 3 tbsp paprika           │
│ • 200ml sour cream         │
├─────────────────────────────┤
│ STEP 1 OF 5                │
│                            │
│ Cut chicken into chunks.   │
│ Season with salt & pepper. │
│                            │
│ [Previous]  [Next Step]    │
├─────────────────────────────┤
│ [Mark as Cooked ✓]         │
└─────────────────────────────┘
```

**Cooking Mode Features:**

- Large touch targets (60px minimum)
- Step-by-step view (no scrolling)
- Wake lock to prevent screen sleep
- Voice control ready (future feature)
