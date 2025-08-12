# Epic 3: Admin Dashboard - Recipe & Plan Management

**Epic Goal:** Build the complete admin interface for content creation and management. This is mission-critical as it enables a single operator to efficiently create high-quality meal plans without domain expertise. Must be thoroughly tested as any failure here affects all users.

## Story 3.1: Admin Dashboard Shell & Navigation

**As an** admin,  
**I want** a dedicated admin interface with clear navigation,  
**so that** I can efficiently manage all content operations.

**Acceptance Criteria:**

1. /admin route protected by admin role check
2. Tab navigation: Recipes | Meal Plans | Validation | Analytics | Settings
3. Status bar showing current week, next publish date, validation status
4. Quick action buttons in header (clone last week, emergency mode)
5. Responsive but optimized for desktop use
6. Dark mode toggle for long work sessions
7. Auto-save indicator showing save status
8. Keyboard shortcut hints (? to show shortcuts)

## Story 3.2: Recipe Management Interface

**As an** admin,  
**I want** to create and manage all recipes efficiently,  
**so that** I have a library of content for meal plans.

**Acceptance Criteria:**

1. Recipe list view with search, filter, sort capabilities
2. Recipe creation form with all required fields (name_ro, ingredients, steps, time, difficulty)
3. Bulk import via CSV with validation
4. Recipe categorization (breakfast, lunch, dinner, snack)
5. Leftover flagging system (marks recipes that create leftovers)
6. Draft vs Published status
7. Quick edit mode for inline changes
8. Delete with confirmation (check if used in plans first)

## Story 3.3: Recipe Testing Mode Implementation

**As an** admin,  
**I want** to preview and test recipes before publishing,  
**so that** I ensure quality and prevent errors.

**Acceptance Criteria:**

1. Preview button opens testing environment
2. Device simulator (mobile/desktop views)
3. Household scaling preview (1-6 people portions)
4. Shopping list impact calculation
5. Image verification (all images load)
6. "Test Passed" flag required before using in plans
7. Quick fix mode - edit while previewing
8. Test checklist tracking (what's been verified)

## Story 3.4: Meal Plan Builder - Visual Interface

**As an** admin,  
**I want** a drag-and-drop interface for creating weekly meal plans,  
**so that** I can visually organize meals and see patterns.

**Acceptance Criteria:**

1. 7-day × 4-meal grid layout
2. Recipe sidebar with search and filters
3. Drag recipes from sidebar to meal slots
4. Visual leftover flow arrows between connected meals
5. Duplicate recipe warnings
6. Auto-save every action
7. Undo/redo functionality (last 20 actions)
8. Clone previous week starting point

## Story 3.5: Meal Plan Builder - Dual Menu Types

**As an** admin,  
**I want** to create both Omnivore and Vegetarian plans,  
**so that** I serve both customer segments.

**Acceptance Criteria:**

1. Toggle between Omnivore and Vegetarian builders
2. Separate storage for each plan type
3. Recipe filtering by menu type compatibility
4. Bulk copy between plans (with substitution suggestions)
5. Side-by-side view option for consistency checking
6. Validation runs separately for each type
7. Publishing controls for each plan
8. Preview what each user type sees

## Story 3.6: Validation System

**As an** admin,  
**I want** automated validation of meal plans,  
**so that** I catch issues before publishing.

**Acceptance Criteria:**

1. Traffic light status (red/yellow/green) for each check
2. Validation rules: nutritional balance, cooking time distribution, ingredient variety
3. Shopping list check (<40 unique items)
4. Leftover logic verification
5. One-click fix suggestions for common issues
6. Override capability with reason documentation
7. Validation history log
8. Cannot publish with red errors (unless emergency override)

## Story 3.7: Shopping List Calculator

**As an** admin,  
**I want** real-time shopping list generation,  
**so that** I can optimize ingredient efficiency.

**Acceptance Criteria:**

1. Live calculation as meals are added/removed
2. Ingredient aggregation across all meals
3. Unit conversion (2x 200g = 400g)
4. Categorization by store sections
5. Unusual ingredient highlighting
6. Export to check against real store inventory
7. Week-to-week comparison tool

## Story 3.8: Publishing Workflow

**As an** admin,  
**I want** a controlled publishing process,  
**so that** meal plans go live at the right time.

**Acceptance Criteria:**

1. Publish button with confirmation dialog
2. Pre-publish checklist (all validations passed)
3. Schedule publishing for Thursday 6 AM
4. Preview mode - see exactly what users will see
5. Rollback capability (revert to previous week)
6. Publishing locks plan from edits
7. Email notification when published
8. Force publish with typed confirmation ("OVERRIDE")

## Story 3.9: Emergency Operations

**As an** admin,  
**I want** emergency controls for crisis management,  
**so that** I can handle issues quickly.

**Acceptance Criteria:**

1. Emergency meal swap (replace problematic recipe)
2. User notification system (send urgent updates)
3. Maintenance mode activation
4. Quick rollback to last week
5. Override all validations (with logging)
6. Hotfix mode - edit published plans
7. Bulk email to affected users
8. Incident log for tracking issues

## Story 3.10: Admin Analytics Dashboard

**As an** admin,  
**I want** to see performance metrics,  
**so that** I can improve content based on data.

**Acceptance Criteria:**

1. Weekly metrics: completion rates, satisfaction scores
2. Recipe performance ranking (most/least cooked)
3. Skip patterns identification
4. Feedback aggregation by meal
5. Shopping list completion rates
6. Time-to-cook accuracy (reported vs actual)
7. Export data for deeper analysis
8. Actionable insights ("Replace X with Y based on feedback")

## Story 3.11: AI Recipe Generation (Gemini-powered)

**As an** admin,  
**I want** Gemini AI to help generate new recipes,  
**so that** I can quickly expand my recipe library without manual creation.

**Acceptance Criteria:**

1. "Generate with AI" button in recipe creation form
2. Prompt builder with context (ingredients available, meal type, cooking time)
3. Gemini 2.5 Flash API integration (free tier)
4. AI generates recipe in correct JSON format (name_ro, ingredients, steps)
5. Preview AI output before saving
6. Edit capability before accepting
7. Batch generation (create 10 recipes at once - Gemini is fast)
8. Fallback to Gemini 2.0 Flash if 2.5 has issues

## Story 3.12: AI Meal Plan Assistant (Gemini-powered)

**As an** admin,  
**I want** Gemini to suggest complete weekly meal plans,  
**so that** I can create plans faster with intelligent recommendations.

**Acceptance Criteria:**

1. "AI Suggest Plan" button in meal plan builder
2. Context includes: last week's plan, ratings, full recipe library, Romanian preferences
3. Gemini returns structured meal suggestions with leftover flows
4. Suggestions populate grid (not auto-saved)
5. One-click acceptance or regeneration
6. Can run multiple times (Gemini is free)
7. Parallel requests for Omnivore and Vegetarian plans
8. Response caching to avoid redundant API calls

## Story 3.13: AI Validation & Quality Check (Gemini-powered)

**As an** admin,  
**I want** Gemini to validate meal plans comprehensively,  
**so that** I ensure quality without domain expertise.

**Acceptance Criteria:**

1. "AI Review" runs comprehensive checks via Gemini
2. Nutritional balance analysis (Gemini has nutrition knowledge)
3. Romanian cultural appropriateness check
4. Shopping list optimization (minimize ingredients)
5. Cooking time realism verification
6. Leftover flow logic validation
7. Detailed explanations for any issues found
8. Can re-run validation multiple times (free API)

## Story 3.14: Admin AI Integration via Vercel AI SDK

**As an** admin,  
**I want** Vercel AI SDK configured for admin features,  
**so that** AI-powered recipe and meal plan generation works seamlessly.

**Acceptance Criteria:**

1. Leverage Story 1.13's base AI SDK setup
2. Admin-specific prompt templates for recipe generation
3. Streaming UI for real-time generation feedback
4. Error handling with fallback to manual mode
5. Token usage tracking for free tier limits
6. Simple on/off toggle for AI features
7. Test button to verify Gemini connection
8. Integration with admin dashboard UI components

## Story 3.15: Copy-Paste Fallback (Backup Option)

**As an** admin,  
**I want** manual copy-paste as emergency fallback,  
**so that** I can work even if Gemini is down.

**Acceptance Criteria:**

1. Fallback mode activates if API fails
2. "Generate Prompt" creates formatted text
3. Instructions for using Gemini web interface
4. Paste field with JSON validation
5. Same UI flow, just manual steps
6. Clear indication when in fallback mode
7. Auto-retry API every 5 minutes

## Story 3.16: Admin Dashboard Comprehensive Testing

**As a** developer,  
**I want** the admin dashboard thoroughly tested,  
**so that** content generation never fails.

**Acceptance Criteria:**

1. **Unit tests (70% coverage):** All validation logic, shopping list calculations, leftover flows
2. **Integration tests:** Recipe → Meal Plan → Publishing flow
3. **E2E test:** Complete weekly plan creation and publication
4. **AI mock testing:** Test AI failures and fallbacks
5. **Data integrity tests:** No orphaned recipes, valid foreign keys
6. **Regression suite:** Run before every deployment
7. **Test scenarios:** Empty week, duplicate recipes, validation overrides
8. **Performance tests:** Builder with 500+ recipes in library

## Story 3.17: Initial Content Library Creation

**As a** product owner,  
**I want** to launch with 4 weeks of unique meal plans,  
**so that** users have variety from day one.

**Acceptance Criteria:**

1. Create 4 weeks of unique meal plans (per FR13)
2. Each week: 28 meals (7 days × 4 meals)
3. Primarily Romanian recipes with 2-3 international per week (per FR14)
4. Weekday dinners <30 minutes active time (per FR15)
5. Both Omnivore and Vegetarian versions (per FR27)
6. Proper leftover flows in each week
7. Shopping lists optimized (<40 items)
8. All recipes tested and validated
9. Store as published weeks 1-4 in database
10. Can be created using AI assistance from admin dashboard

## Story 3.18: OpenFoodFacts Integration for Ingredient Management

**As an** admin,  
**I want** ingredients to auto-complete from OpenFoodFacts database,  
**so that** I have accurate nutritional data and standardized ingredient naming without manual entry.

**Acceptance Criteria:**

1. Integrate OpenFoodFacts Romania API for ingredient lookup
2. Autocomplete dropdown shows matching ingredients while typing
3. Display nutritional values (calories, carbs, protein, etc.) for each suggestion
4. Show OpenFoodFacts ID for reference
5. Allow manual entry for ingredients not in database
6. Save manually entered ingredients to local database
7. Mark ingredients with status: "✓ In DB" (from OpenFoodFacts) or "⚠️ New" (manual entry)
8. Provide dedicated Ingredient Lookup modal with search and filtering
9. Support bulk ingredient import from OpenFoodFacts
10. Cache frequently used ingredients for performance
11. Handle API failures gracefully with fallback to local database
12. Support both Romanian and English ingredient names

**Technical Implementation:**

- OpenFoodFacts API endpoint: https://ro.openfoodfacts.org/api/v2/
- Cache layer for frequent lookups (Redis or in-memory)
- Local database table for custom ingredients
- Debounced search to minimize API calls
- Progressive enhancement - works without JavaScript
