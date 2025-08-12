# Requirements

## Functional Requirements

- **FR1:** The system shall generate complete weekly meal plans including breakfast, lunch, dinner, and snacks for 1-6 people
- **FR2:** Meal plans shall follow 1-3 day batch cooking patterns with intelligent leftover flow (e.g., Sunday roast → Monday sandwiches)
- **FR3:** The system shall generate next week's meal plan every Wednesday at 2 PM, send notifications at 6 PM, with plans visible Thursday 6 AM
- **FR4:** Users shall be able to select between Omnivore or Vegetarian menu types
- **FR5:** The system shall automatically calculate portion scaling for household size (1-6 people)
- **FR6:** Interactive shopping lists shall be organized by customizable categories with search function, alphabetical sorting option, PDF export, and email delivery
- **FR7:** Users shall be able to mark meals as cooked and provide thumbs up/down feedback
- **FR8:** The system shall provide a 3-day free trial with a special curated menu showcasing best recipes (no credit card required), which users keep forever as a gift
- **FR9:** Recipe cards shall include step-by-step instructions, cooking times, and difficulty levels
- **FR10:** Previous week's meal plan shall remain visible for 3 days as read-only reference
- **FR32:** Users shall be able to set their preferred default view (Week View or Today Focus) in settings
- **FR35:** The system shall display user-friendly error states with clear actions (retry, contact support, navigate back)
- **FR36:** Loading states shall use skeleton screens matching layout structure, not generic spinners
- **FR37:** The system shall implement optimistic UI updates for user actions (mark cooked, feedback) with background sync
- **FR11:** Custom admin dashboard shall provide cohesive meal plan creation interface with visual builder, recipe management, and AI-powered validation system to ensure meal plan quality without requiring nutritionist or chef expertise (Note: This investment replaces need for domain experts and prevents costly content errors)
- **FR12:** Shopping lists shall allow checking off items and marking "already have" ingredients
- **FR13:** The system shall launch with 4 weeks of unique meal plans, expanding to 12 weeks by Month 3
- **FR14:** Each weekly plan shall primarily feature Romanian recipes with 2-3 international meals for variety
- **FR15:** Weekday dinners shall require <30 minutes active cooking time
- **FR16:** Admin interface shall support multiple user accounts with standard auto-save (no real-time collaboration)
- **FR17:** Meal plan builder shall visually display leftover flow connections and provide real-time shopping list calculation
- **FR18:** The system shall support monthly recurring subscription at 50 RON and annual subscription at 550 RON (save 50 RON) via Stripe
- **FR19:** Users shall be able to pause subscription for up to 4 weeks (vacation mode) with read-only access to previous plans
- **FR20:** Users shall be able to cancel subscription with immediate access through current billing period
- **FR21:** The system shall provide refunds: monthly plans within first 7 days, annual plans full refund within 30 days
- **FR22:** Subscription management shall be self-service through user dashboard
- **FR23:** The system shall support payment methods: card (Visa/Mastercard) and PayPal
- **FR24:** Failed payment retry logic shall attempt 3 times over 7 days before suspension
- **FR25:** Users shall receive email receipts for all payment transactions
- **FR26:** Trial users converting to paid shall immediately access the current week's full meal plan regardless of which day they subscribe
- **FR27:** The system shall maintain separate meal plans for Omnivore and Vegetarian options each week
- **FR28:** Shopping lists shall support customizable categories, search functionality, and multiple sorting options
- **FR29:** The trial menu shall be a fixed, separate 3-day showcase menu independent of weekly rotations
- **FR30:** Admin dashboard shall include AI-powered validation to check nutritional balance, cooking time accuracy, leftover logic, ingredient availability, and prevent impossible combinations (Critical: This system replaces need for hired nutrition/culinary experts)
- **FR38:** Admin dashboard shall provide AI-assisted meal plan generation with options to: generate complete week from scratch, suggest replacements based on past ratings, auto-fill gaps in partial plans, and create variations of successful previous weeks
- **FR39:** AI recipe creation shall support: generating new recipes from ingredients list, adapting international recipes to Romanian style, creating leftover transformation recipes, and suggesting ingredient substitutions
- **FR31:** Admin dashboard shall support hybrid recipe import through CSV/JSON bulk upload, web scraping with attribution from Romanian recipe sites, and AI-assisted generation, with all imports passing through AI validation before publishing (Critical: Prevents "death by tedium" of manual entry)
- **FR33:** All code shall pass ESLint rules prohibiting hardcoded text and CSS values - text must use i18n keys, styles must use design tokens
- **FR34:** Every user story completion requires passing Definition of Done checklist including lint rules, tests, and code quality standards
- **FR40:** The system shall provide a manual 'Guest Mode' toggle that adds a reminder to the shopping list for the user to adjust quantities, without automatic scaling.
- **FR41:** The system shall display nutritional information (calories, protein, etc.) on the Recipe Detail and Today Focus views.
- **FR42:** The admin dashboard shall integrate with the OpenFoodFacts API to search for ingredients and automatically populate their nutritional data.

## Non-Functional Requirements

- **NFR1:** Page load time shall be under 2 seconds on 4G mobile connections
- **NFR2:** The system shall maintain 99.5% uptime for core features
- **NFR3:** Shopping lists must support PDF export for offline use
- **NFR4:** The application shall be mobile-first responsive, supporting iOS 14+ and Android 10+
- **NFR5:** All payment processing shall be PCI compliant via Stripe integration
- **NFR6:** The system shall be GDPR compliant for EU data protection requirements
- **NFR7:** API responses shall complete within 500ms for meal plan retrieval
- **NFR8:** The platform shall support Romanian language as primary UI language
- **NFR9:** Infrastructure costs shall remain under €100/month for first 1000 users
- **NFR10:** The system shall use serverless architecture with Supabase for backend and edge functions for automation
- **NFR11:** Content creation pipeline must produce 2 weeks ahead of publication
- **NFR12:** System shall send notifications for: plan ready, shopping reminder, trial ending
- **NFR13:** Admin dashboard shall load in <3 seconds and provide auto-save every 60 seconds with local draft storage every 10 seconds
- **NFR14:** Payment processing shall complete within 3 seconds
- **NFR15:** Subscription billing shall run automatically at 2 AM on renewal date
- **NFR16:** Payment failure notifications shall be sent within 1 hour of failure
