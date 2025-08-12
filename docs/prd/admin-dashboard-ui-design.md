# Admin Dashboard UI Design

## Dashboard Philosophy

Task-focused modular interface designed for single operator efficiency. Clear separation of concerns with progressive disclosure to reduce cognitive load during daily operations.

## Main Navigation

- **Tab-based structure:** Recipes | Meal Plans | Validation | Analytics | Settings
- **Status bar:** Current week display, validation status indicators, publication deadlines
- **Quick actions:** Clone last week, emergency override, quick stats

## Meal Plan Builder Interface

- **Calendar grid view:** 7 days × 4 meals visual grid
- **Drag-drop functionality:** Drag recipes from sidebar into meal slots with auto-save on every action
- **Visual leftover flows:** Arrows showing batch cooking connections (Sunday roast → Monday sandwich)
- **Inline validation:** Real-time warnings for complexity, timing, variety issues
- **Publishing safeguards:** Blocking errors prevent publish (missing meals, validation failures), requires confirmation
- **Live shopping list:** Side panel showing ingredient aggregation updating in real-time
- **Dual builders:** Separate interfaces for Omnivore and Vegetarian plans
- **Quick actions:** Clone week, clear day, auto-fill with suggestions

## Recipe Management

- **Table view:** Sortable/filterable list with inline editing
- **Bulk operations:** CSV/JSON import, batch tagging, bulk delete
- **Preview cards:** Visual preview before publishing
- **Categorization:** Meal type, cuisine, difficulty, cooking time badges
- **Leftover flagging:** Mark recipes with leftover potential
- **Quick search:** Find recipes by name, ingredient, or tag

## Validation Dashboard

- **Traffic light system:** Red (blocking), Yellow (warning), Green (pass)
- **Validation checklist:**
  - ✓ Nutritional balance
  - ✓ Cooking time distribution
  - ✓ Ingredient variety
  - ✓ Shopping list efficiency (<40 items)
  - ✓ Leftover logic integrity
- **Auto-fix suggestions:** One-click fixes for common issues
- **Override capability:** Manual override with documented reason

## Emergency Operations Panel

- **Quick meal swap:** Emergency recipe replacement
- **User notification:** Send urgent updates to active users
- **Force publish:** Override validation with typed confirmation ("OVERRIDE AND PUBLISH")
- **Downtime mode:** Activate maintenance message

## Analytics View

- **Week performance:** Meal ratings, completion rates, skip patterns
- **Feedback summary:** Aggregated user feedback with sentiment
- **Trend analysis:** Popular meals, problematic recipes, timing issues
- **Actionable insights:** Suggested improvements based on data

## AI Assistant Integration (Admin Only)

**Simple Integration Approach:**
The admin dashboard includes an "AI Assistant" button that provides smart autocomplete for meal planning. AI suggests meals to fill gaps, you review and approve.

**How It Works:**

1. **Context Gathering** - Admin dumps current week draft, last week's ratings, and recipe library to AI
2. **AI Suggestion** - AI returns JSON-formatted meal suggestions based on Romanian patterns
3. **Auto-Population** - Suggestions populate into meal grid (not saved)
4. **Human Review** - You adjust, fix, or regenerate as needed
5. **Save When Ready** - Only saves after your approval

**Integration Options (choose one during development):**

- **Option A: Copy-Paste** - Manual prompt copy to Claude/ChatGPT, paste response back
- **Option B: API Integration** - Direct OpenAI/Anthropic API calls from admin
- **Option C: Local AI** - Ollama running locally for free suggestions

**AI Response Format:**

```json
{
  "suggestions": [
    {
      "day": "Tuesday",
      "meal": "dinner",
      "recipe_name": "Ciorbă de burtă",
      "cooking_time": 45,
      "ingredients": ["tripe", "sour cream", "eggs"],
      "leftovers_to": "Wednesday lunch"
    }
  ]
}
```

**Prompt Template:**

```
Generate Romanian family meals using common Kaufland ingredients.
Sunday: max 2 hours. Weekdays: max 30 minutes.
Current week: [JSON of partial plan]
Last week ratings: [JSON of feedback]
Fill empty slots. Return as JSON.
```

**Safety:** AI suggests, human decides. No automatic publishing. You catch and fix any AI nonsense before it reaches users.

## Recipe Testing Mode

**Preview Environment:**

- **User View Simulator:** Admin can preview exactly how recipes appear in user interface
- **Device Preview:** Toggle between mobile (iPhone/Android) and desktop views
- **State Testing:** View recipe in different states (trial user, paid user, expired trial)
- **Interaction Testing:** Test mark as cooked, thumbs up/down, shopping list addition
- **PDF Preview:** Generate and review PDF export before publishing

**Test User Accounts:**

- **Test Profiles:** 3 pre-configured test accounts (single person, couple, family of 4)
- **Household Scaling:** Verify portion calculations for 1-6 people
- **Menu Type Testing:** Switch between Omnivore and Vegetarian views
- **Trial State Testing:** See how content appears during trial vs paid experience

**Validation Checks in Test Mode:**

- **Image Loading:** Verify all recipe images load correctly
- **Instruction Clarity:** Step-by-step walkthrough with timer estimates
- **Ingredient Availability:** Flag any unusual ingredients not found at Kaufland/Mega
- **Leftover Logic:** Trace leftover connections across multiple days
- **Shopping List Impact:** See how recipe affects weekly shopping list totals

**Test Mode Actions:**

- **Save as Draft:** Keep recipe in testing without publishing
- **Request Feedback:** Send preview link to beta testers (optional feature)
- **A/B Test Flag:** Mark recipes for performance comparison
- **Quick Fix:** Edit recipe directly from preview with instant refresh
- **Publish with Confidence:** Green checkmark only appears after test validation passes

**Mobile Admin Testing:**

- **Quick Preview:** Read-only recipe preview on admin's phone
- **QR Code Generation:** Scan to preview on actual mobile device
- **Real Device Testing:** Ensures responsive design works correctly

**Testing Workflow:**

1. Create/import recipe → Auto-saves as draft
2. Enter Testing Mode → Full preview environment
3. Run through validation checklist
4. Fix any issues in split-screen edit mode
5. Mark as "Test Passed" → Available for meal plan builder
6. Only tested recipes can be added to weekly plans

## Mobile Considerations

- **Responsive design:** Read-only mobile view for analytics and monitoring
- **Critical actions only:** Emergency overrides accessible on mobile
- **Desktop-optimized builders:** Complex interfaces remain desktop-focused for MVP
