# Component Technical Reference

_Detailed implementation specifications for all UI components_

> **Note:** For design tokens and high-level component architecture, see [UNIFIED-DESIGN-SYSTEM.md](./UNIFIED-DESIGN-SYSTEM.md)

## Component Implementation Specifications

### Components Identified from Our Wireframes

**Navigation Components:**

1. **WeekNavigator** - Week selector with arrows (◀ Săpt 15-21 Ian 2024 ▶)
2. **BottomTabBar** - Mobile navigation (Azi | Săptămână | Listă | Cont)
3. **BackButton** - Simple back navigation (◀ Înapoi)

**Meal Planning Components:** 4. **MealCard** - Compact meal display with emoji, time, status 5. **WeekGrid** - 7x4 or 5x4 responsive grid layout 6. **LeftoverArrow** - Visual connection between meals (→, 🔄) 7. **MealStatusIcon** - Checkmark or X for completion (✓, ✅, ❌) 8. **TodayMealCard** - Expanded meal card with image and actions

**Shopping Components:** 9. **SearchBar** - Input with search icon (🔍 Caută...) 10. **ShoppingCategory** - Collapsible category section 11. **ShoppingItem** - Checkbox item with quantity 12. **ProgressCounter** - Items checked counter (✓ 2/15 articole) 13. **ExportButton** - PDF/Email export options

**Recipe Components:** 14. **RecipeHeader** - Title, time, portions display 15. **IngredientsList** - Bulleted ingredient list 16. **InstructionsList** - Numbered steps 17. **BatchNote** - Special instructions for batch cooking 18. **CookingActionButton** - Primary action (Marchează Gătit ✓)

**Feedback Components:** 19. **FeedbackModal** - Modal with options 20. **FeedbackDropdown** - Predefined problem options 21. **TextInput** - Optional feedback text

**Admin Components:** 22. **ConstraintCheckbox** - Active constraints list 23. **MealSlotSelector** - Dropdown or auto option 24. **StatsPanel** - Cost, time, calories display 25. **AdminActionBar** - Validate, Save, Publish buttons

**Loading/Error Components:** 26. **SkeletonLoader** - Placeholder with shimmer (░░░) 27. **ErrorMessage** - Icon with error text 28. **RetryButton** - Action to retry 29. **ContactSupportLink** - Support option

**Onboarding Components:** 30. **OnboardingCard** - Step content container 31. **PreferenceSelector** - Number/option selector 32. **TrialBenefitsList** - Checkmarked benefits 33. **PlanPreview** - Week summary display

**Empty State Components:** 34. **EmptyIcon** - Visual indicator (📭, ✅) 35. **EmptyMessage** - Descriptive text 36. **EmptyAction** - CTA button

**Notification Components:** 37. **ToastNotification** - Temporary message 38. **ToastAction** - Inline action buttons 39. **DismissButton** - Close notification (×)

## Component Architecture Foundation

### Core Principles

- **Mobile-first:** Designed for touch and small screens
- **Romanian-first:** All UI text in Romanian
- **Performance-focused:** Minimal animations, fast interactions
- **Accessibility-ready:** WCAG AA compliance
- **Type-safe:** Full TypeScript coverage

### Technology Stack

- **Base:** React 18+ with TypeScript
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS with custom design tokens
- **State Management:** Zustand for global, React Query for server
- **Forms:** React Hook Form + Zod validation
- **Icons:** Custom meal emojis + Tabler Icons for UI

## Component Categories

### Marketing & Homepage Components

1. **Hero Section** - Landing page banner with CTA
2. **Pricing Card** - Subscription plan display
3. **Feature Grid** - Benefits showcase
4. **Testimonial Card** - User reviews
5. **FAQ Accordion** - Expandable Q&A
6. **CTA Banner** - Conversion prompts
7. **Footer** - Site-wide navigation
8. **Newsletter Signup** - Email capture

### Core App Components

9. **Meal Card** - Visual meal display
10. **Week Calendar Grid** - 7x4 meal planner view
11. **Shopping List Item** - Checkable ingredient
12. **Recipe View** - Step-by-step instructions
13. **Cooking Timer** - Countdown display
14. **Progress Ring** - Circular completion
15. **Savings Counter** - Animated money saved
16. **Navigation Bar** - App navigation
17. **Day Selector** - Week day picker
18. **Leftover Arrow** - Visual flow connector

### Form & Input Components

19. **Text Input** - Standard text field
20. **Password Input** - With show/hide toggle
21. **Select Dropdown** - Option selector
22. **Checkbox** - Multi-select option
23. **Radio Group** - Single select
24. **Toggle Switch** - On/off control
25. **Date Picker** - Calendar input
26. **Search Bar** - With autocomplete
27. **Number Stepper** - Quantity selector

### Feedback Components

28. **Toast Notification** - Temporary messages
29. **Modal Dialog** - Overlay dialogs
30. **Loading Skeleton** - Content placeholder
31. **Error Boundary** - Error display
32. **Empty State** - No content display
33. **Badge** - Status indicators
34. **Tooltip** - Hover information

### Admin Components

35. **Data Table** - Sortable/filterable grid
36. **Meal Selector** - Drag-drop planner
37. **Analytics Card** - Metric display
38. **Bulk Actions Bar** - Multi-select actions
39. **File Upload** - Image uploader

### AI Assistant Components

40. **Chat Message** - Conversation display
41. **Suggestion Card** - AI recommendations
42. **Validation Badge** - AI approval indicator

### Utility Components

43. **Avatar** - User profile image
44. **Divider** - Content separator
45. **Breadcrumb** - Navigation trail
46. **Tab Panel** - Content switcher
47. **Pagination** - Page navigation

## App-Specific Components

### Meal Card Component

**Purpose:** Display individual meal with visual appeal and key information

**Variants:**

- `default`: Full card with image
- `compact`: No image, just text
- `leftover`: Highlighted with arrow indicator
- `locked`: Grayed out for non-subscribers

**States:**

- Default, Hover, Selected, Cooked (checkmark overlay), Loading

**Props:**

```typescript
interface MealCardProps {
  id: string;
  title: string;
  image?: string;
  cookTime: number;
  servings: number;
  isLeftover?: boolean;
  isCooked?: boolean;
  isLocked?: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onClick?: () => void;
}
```

**Usage Guidelines:**

- Always lazy-load images
- Show cooking time badge in top-right
- Use skeleton loader while image loads
- Checkmark animation when marked as cooked

### Week Calendar Component

**Purpose:** 7-day x 4-meal grid view of weekly plan

**Variants:**

- `full`: Desktop 7-column grid
- `mobile`: Single day or swipeable carousel
- `compact`: 4-day view for tablets

**States:**

- Loading (skeleton grid), Ready, Updating

**Props:**

```typescript
interface WeekCalendarProps {
  weekStart: Date;
  meals: MealPlan[];
  onMealClick: (meal: MealPlan) => void;
  onMarkCooked: (mealId: string) => void;
  view: 'week' | 'today' | '4day';
}
```

**Usage Guidelines:**

- Today column highlighted with blue border
- Leftover arrows connect related meals
- Smooth transitions between view modes
- Maintain scroll position on updates

### Shopping List Item Component

**Purpose:** Checkable ingredient with quantity

**Variants:**

- `default`: Unchecked item
- `checked`: Strikethrough with green check
- `urgent`: Items expiring soon

**States:**

- Unchecked, Checked, Disabled (out of stock)

**Props:**

```typescript
interface ShoppingListItemProps {
  id: string;
  name: string;
  quantity: string;
  category: string;
  isChecked: boolean;
  onToggle: (id: string) => void;
  expiryDays?: number;
}
```

**Usage Guidelines:**

- Swipe right to check (mobile)
- Click anywhere to toggle
- Group by category
- Show expiry warning if <3 days

### Recipe Step Component

**Purpose:** Single instruction step optimized for cooking

**Variants:**

- `current`: Active step, enlarged
- `completed`: Checkmark, faded
- `upcoming`: Preview of next step

**States:**

- Pending, Active, Completed

**Props:**

```typescript
interface RecipeStepProps {
  stepNumber: number;
  instruction: string;
  duration?: number;
  isActive: boolean;
  isComplete: boolean;
  ingredients?: string[];
  onComplete: () => void;
}
```

**Usage Guidelines:**

- Minimum 18px font in cooking mode
- Large touch target for navigation
- Timer integration for timed steps
- Voice reading preparation (future)

### Savings Display Component

**Purpose:** Show accumulated savings prominently

**Variants:**

- `hero`: Large homepage display
- `dashboard`: Weekly summary
- `milestone`: Achievement celebration

**States:**

- Counting (animated), Static, Celebrating (milestone reached)

**Props:**

```typescript
interface SavingsDisplayProps {
  amount: number;
  period: 'week' | 'month' | 'total';
  comparison?: string; // "2 delivery orders"
  animate?: boolean;
}
```

**Usage Guidelines:**

- Use RON currency symbol
- Animate on first view only
- Include relatable comparison
- Celebrate round numbers (100, 500, 1000)

## Form Components

### Input Field Component

**Purpose:** Text input with validation and helpers

**Variants:**

- `text`: Standard text input
- `email`: Email validation
- `password`: With show/hide toggle
- `number`: Numeric input with steppers

**States:**

- Default, Focus, Error, Success, Disabled

**Props:**

```typescript
interface InputFieldProps {
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  value: string;
  error?: string;
  helper?: string;
  required?: boolean;
  onChange: (value: string) => void;
}
```

**Usage Guidelines:**

- Always show labels (no placeholder-only)
- Error messages below field
- Red border for errors
- Green check for valid

### Select Component

**Purpose:** Dropdown selector with search

**Variants:**

- `default`: Click to open dropdown
- `searchable`: Type to filter options
- `multi`: Multiple selection with tags

**States:**

- Closed, Open, Searching, Loading options

**Props:**

```typescript
interface SelectProps {
  options: Option[];
  value: string | string[];
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
}
```

**Usage Guidelines:**

- Mobile: Full-screen modal selector
- Desktop: Dropdown below field
- Show selected count for multi-select
- Escape key closes dropdown

## Marketing Components

### Pricing Card Component

**Purpose:** Display subscription plans

**Variants:**

- `monthly`: 50 RON/month display
- `annual`: 550 RON/year with savings badge
- `trial`: 3-day free trial card

**States:**

- Default, Highlighted (recommended), Selected

**Props:**

```typescript
interface PricingCardProps {
  plan: 'monthly' | 'annual' | 'trial';
  price: number;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}
```

**Usage Guidelines:**

- Annual shows "Save 100 RON" badge
- Highlight popular choice
- List 3-5 key features
- Single CTA button

### Hero Section Component

**Purpose:** Landing page primary banner

**Variants:**

- `homepage`: Full-width with background
- `product`: With app preview image
- `simple`: Text-only for subpages

**States:**

- Static with animated elements on scroll

**Props:**

```typescript
interface HeroSectionProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaAction: () => void;
  backgroundImage?: string;
  stats?: Stat[];
}
```

**Usage Guidelines:**

- Headline max 10 words
- Subheadline explains value
- Single primary CTA
- Stats below fold on mobile

## Feedback Components

### Toast Notification Component

**Purpose:** Temporary success/error messages

**Variants:**

- `success`: Green with checkmark
- `error`: Red with X
- `info`: Blue with i
- `warning`: Orange with !

**States:**

- Entering (slide in), Visible, Exiting (fade out)

**Props:**

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // ms
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage Guidelines:**

- Position bottom-center mobile
- Position top-right desktop
- Auto-dismiss after 3s (5s for errors)
- Queue multiple, don't stack

### Loading Skeleton Component

**Purpose:** Placeholder while content loads

**Variants:**

- `text`: Single or multi-line text
- `card`: Meal card shape
- `list`: Multiple item rows
- `image`: Rectangle with shimmer

**States:**

- Animated shimmer effect

**Props:**

```typescript
interface SkeletonProps {
  type: 'text' | 'card' | 'list' | 'image';
  lines?: number;
  width?: string;
  height?: string;
}
```

**Usage Guidelines:**

- Match exact content layout
- Use subtle shimmer animation
- Preserve layout during loading
- No generic spinners

### Modal Dialog Component

**Purpose:** Overlay for important interactions

**Variants:**

- `default`: Standard modal
- `fullscreen`: Mobile full-screen
- `drawer`: Slide from bottom/side

**States:**

- Closed, Opening, Open, Closing

**Props:**

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
}
```

**Usage Guidelines:**

- Trap focus while open
- Escape key closes
- Smooth fade + scale animation
- Return focus on close

## Navigation Components

### Bottom Tab Bar Component

**Purpose:** Mobile app navigation

**Variants:**

- `user`: 4 tabs (Today, Week, Shop, Account)
- `admin`: Different tab set

**States:**

- Tab active/inactive states

**Props:**

```typescript
interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```

**Usage Guidelines:**

- Fixed bottom position
- 60px height minimum
- Active tab highlighted
- Badge for notifications

### Breadcrumb Component

**Purpose:** Show navigation hierarchy

**Variants:**

- `default`: Clickable path
- `current`: Last item not clickable

**States:**

- Default, Hover on links

**Props:**

```typescript
interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
  separator?: string;
}
```

**Usage Guidelines:**

- Mobile: Show only current + parent
- Desktop: Show full path
- Truncate long labels
- Use > or / separator

## Admin Components

### Data Table Component

**Purpose:** Display tabular data with sorting/filtering

**Variants:**

- `default`: Standard table
- `selectable`: Checkbox column
- `expandable`: Expandable rows

**States:**

- Loading, Empty, Error, Ready

**Props:**

```typescript
interface DataTableProps {
  columns: Column[];
  data: any[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  onRowClick?: (row: any) => void;
}
```

**Usage Guidelines:**

- Sticky header on scroll
- Responsive: Cards on mobile
- Bulk actions bar when selecting
- Export functionality

### Analytics Card Component

**Purpose:** Display metrics and KPIs

**Variants:**

- `number`: Single large number
- `chart`: With mini chart
- `comparison`: With period comparison

**States:**

- Loading, Ready, Updating

**Props:**

```typescript
interface AnalyticsCardProps {
  title: string;
  value: number | string;
  change?: number;
  period?: string;
  chart?: ChartData;
}
```

**Usage Guidelines:**

- Green/red for positive/negative change
- Sparkline for trends
- Click for detailed view
- Auto-refresh every minute

## Utility Components

### Filter Bar Component

**Purpose:** Filter and search controls

**Variants:**

- `simple`: Search only
- `advanced`: Multiple filters
- `preset`: Quick filter buttons

**States:**

- Active, Inactive, Removing

**Props:**

```typescript
interface FilterBarProps {
  filters: Filter[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onSearch?: (query: string) => void;
}
```

**Usage Guidelines:**

- Clear all button if 2+ filters
- Smooth add/remove animations
- Consistent with form styling
- Group related filters

### Empty State Component

**Purpose:** Placeholder when no content

**Variants:**

- `no-results`: Search returned nothing
- `no-content`: Awaiting first content
- `error`: Something went wrong

**States:**

- Static display

**Props:**

```typescript
interface EmptyStateProps {
  type: 'no-results' | 'no-content' | 'error';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage Guidelines:**

- Helpful illustration or icon
- Clear explanation
- Action button if applicable
- Consistent tone with brand

### Toggle Switch Component

**Purpose:** Binary on/off controls

**Variants:**

- `default`: Standard size
- `labeled`: With on/off labels

**States:**

- Off, On, Disabled, Loading

**Props:**

```typescript
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}
```

**Usage Guidelines:**

- Clear visual state change
- Smooth transition (200ms)
- Label on left, toggle on right
- Keyboard accessible (spacebar)

### Radio Group Component

**Purpose:** Single selection from options

**Variants:**

- `vertical`: Stacked options
- `horizontal`: Side by side
- `cards`: Large clickable cards

**States:**

- Unselected, Selected, Disabled

**Props:**

```typescript
interface RadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  layout?: 'vertical' | 'horizontal' | 'cards';
}
```

**Usage Guidelines:**

- Clear selection indicator
- Click label or button to select
- Keyboard navigation (arrows)
- Group label for accessibility

### Checkbox Component

**Purpose:** Multiple selections or agreements

**Variants:**

- `default`: Standard checkbox
- `indeterminate`: Partial selection

**States:**

- Unchecked, Checked, Indeterminate, Disabled

**Props:**

```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
}
```

**Usage Guidelines:**

- Clear checkmark icon
- Click label or box to toggle
- Error state for required fields
- Group related checkboxes
