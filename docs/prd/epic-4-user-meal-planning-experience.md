# Epic 4: User Meal Planning Experience

**Epic Goal:** Create the core meal planning interface where users access their weekly meal plans, interact with recipes, manage shopping lists, and track their cooking progress. This is the core value delivery mechanism for subscribers.

## Story 4.1: User Dashboard Layout

**As a** paying user,  
**I want** a clear dashboard showing my meal plan,  
**so that** I can quickly see what I'm cooking this week.

**Acceptance Criteria:**

1. Default to Week View (or user's preferred view from settings per FR32)
2. Current day highlighted with visual emphasis
3. Progress indicators showing meals cooked
4. Time savings banner ("You saved 3+ hours this week!")
5. Quick navigation between Week/Today views
6. Responsive design optimized for mobile
7. Cooking streak counter
8. Auto-refresh when new plan publishes Thursday 6 AM

## Story 4.2: Week View Implementation

**As a** user,  
**I want** to see my entire week's meals at a glance,  
**so that** I can plan ahead and see patterns.

**Acceptance Criteria:**

1. 7-day grid with 4 meals per day (per FR1)
2. Visual meal cards with images and cooking time
3. Leftover indicators showing flow (per FR2)
4. Completion checkmarks for cooked meals
5. Today's column highlighted
6. Tap/click to expand meal details
7. Previous week visible for 3 days only (per FR10)
8. Mobile-responsive layout

## Story 4.3: Today Focus View

**As a** user,  
**I want** a focused view of today's meals,  
**so that** I can concentrate on what to cook now.

**Acceptance Criteria:**

1. Large cards for today's 4 meals
2. Cooking instructions expandable inline
3. Mark as cooked functionality
4. Quick access to tomorrow's preview
5. Leftover alerts ("Use Sunday's chicken")
6. Settings option to make this default view (per FR32)
7. Mobile-optimized interface

## Story 4.4: Meal Detail & Recipe View

**As a** user,  
**I want** complete recipe information,  
**so that** I can cook the meal successfully.

**Acceptance Criteria:**

1. Full recipe with step-by-step instructions (per FR9)
2. Ingredient list with automatic portion scaling (per FR5)
3. Photo display
4. Difficulty and time indicators
5. Nutritional information display
6. Print recipe option
7. Back navigation to week/today view

## Story 4.5: Interactive Shopping List

**As a** user,  
**I want** a smart shopping list,  
**so that** I can shop efficiently once per week.

**Acceptance Criteria:**

1. Aggregated ingredients for full week
2. Check off items while shopping (per FR12)
3. "Already have" marking for pantry items (per FR12)
4. Category organization - customizable (per FR6, FR28)
5. Search functionality (per FR6)
6. Alphabetical sorting option (per FR6)
7. PDF export with branding (per FR6)
8. Email delivery option (per FR6)

## Story 4.6: Meal Feedback System

**As a** user,  
**I want** to give feedback on meals,  
**so that** future plans match my preferences.

**Acceptance Criteria:**

1. Thumbs up/down after marking cooked (per FR7)
2. Optional comment field for detailed feedback
3. Mark meals as cooked (per FR7)
4. Feedback saves immediately
5. No intrusive popups
6. Anonymous aggregation for admin

## Story 4.7: User Settings & Preferences

**As a** user,  
**I want** to customize my experience,  
**so that** the app works how I prefer.

**Acceptance Criteria:**

1. Household size adjustment 1-6 people (per FR5)
2. Menu type: Omnivore or Vegetarian (per FR4)
3. Default view selection: Week/Today (per FR32)
4. Notification preferences
5. Shopping list category customization (per FR28)
6. Account information display

## Story 4.8: Trial vs Paid Experience

**As a** user,  
**I want** appropriate access based on my subscription status,  
**so that** I understand what I'm paying for.

**Acceptance Criteria:**

1. Trial: 3-day curated menu, full functionality (per FR8)
2. Trial: Recipes remain visible forever as gift (per FR8)
3. Trial: Cannot access other weeks
4. Trial: Upgrade CTA non-intrusive
5. Paid: Full access to current week
6. Paid: Previous week visible for 3 days (per FR10)
7. Expired: Read-only access to gifted trial menu

## Story 4.9: Recipe Cooking Assistant (AI-Powered)

**As a** user,  
**I want** to chat with an AI about the recipe I'm cooking,  
**so that** I can get help without leaving the recipe view.

**Acceptance Criteria:**

1. "Ask AI Chef" button on recipe detail view
2. Chat interface using Vercel AI SDK's useChat hook
3. Real-time streaming responses (no loading spinner)
4. AI context includes ONLY current recipe (ingredients, steps, cooking time)
5. Common quick buttons: "Too salty" | "Burning" | "Timing help" | "Substitution"
6. AI cannot suggest ingredients NOT in the recipe (enforced via system prompt)
7. AI cannot change cooking method fundamentally (bounded context)
8. Chat history persists during session only
9. Small banner: "AI Chef - Free for now!" (sets expectation for future monetization)
10. Graceful degradation if API limit reached

## Story 4.10: Critical User Flow E2E Test

**As a** developer,  
**I want** core user journeys tested end-to-end,  
**so that** users always have working features.

**Acceptance Criteria:**

1. **Trial flow E2E:** Signup → View trial → Upgrade → Payment
2. **Weekly flow E2E:** Login → View week → Mark cooked → Shopping list → PDF
3. **Mobile E2E:** Key flows work on mobile viewport
4. **Subscription E2E:** Cancel → Reactivate → Pause → Resume
5. Run nightly in CI
6. Screenshots on failure
7. Test against production data copy
