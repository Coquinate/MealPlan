# Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for Coquinate's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

## Overall UX Goals & Principles

### Target User Personas

**1. Busy Urban Parent:** Dual-income household, ages 28-45, living in major Romanian cities. Faces daily meal decision fatigue, makes 2-3 inefficient grocery trips weekly, relies on delivery apps 3+ times per week. Values time-saving solutions and wants healthy, culturally-relevant meals.

**2. Time-Conscious Professional:** Single or couple, ages 25-40, prioritizes efficiency and convenience. Limited cooking experience but wants to eat home-cooked meals. Needs simple, quick recipes with clear instructions.

**3. Budget-Conscious Family:** Household of 3-6 people, focused on reducing food waste and monthly expenses. Currently spends 600+ RON on delivery apps. Wants to save money while providing variety for the family.

**4. Admin/Content Operator:** Multiple admin accounts with identical permissions managing meal plan creation. Typically founder plus early employees. Not chefs or nutritionists. Create weekly meal plans in 2-hour time blocks while handling other responsibilities. Need efficient tools, AI validation for confidence, and clear error prevention. All admins have full access to all features - no role hierarchy or permission restrictions. Success measured by user completion rates and minimal complaints.

### Usability Goals

- **Immediate value:** New users see their first meal plan within 2 minutes of signup
- **Minimal cognitive load:** Weekly planning requires zero decisions from users
- **Quick task completion:** Shopping list to PDF export in 3 taps
- **Error prevention:** Clear visual indicators for leftover flows and cooking status
- **Mobile efficiency:** Core tasks optimized for one-handed mobile use

### Design Principles

1. **Polished efficiency** - Clean, professional interface with subtle sophistication. Think Revolut's confidence meets BT Pay's local trust. Smooth micro-interactions that feel premium but never slow you down.

2. **Smart Romanian defaults** - Pre-configured for local patterns (Saturday shopping, Sunday cooking, Romanian meal times). Shows we understand the culture without being patronizing.

3. **Elegant cooking intelligence** - Batch cooking flows visualized with refined arrows and subtle animations. Professional food photography that looks achievable, not intimidating. Quality that says "restaurant-grade but home-made."

4. **Confident value display** - Savings shown prominently but tastefully. Use subtle progress animations and achievement moments. "You're saving 3+ hours" with a sleek progress ring, not aggressive banners.

5. **Sophisticated simplicity** - WCAG AA compliant with thoughtful details. Shadows, gradients, and transitions that feel modern. The kind of app you'd show your colleagues - impressive but approachable.

6. **Trust through polish** - Every interaction feels considered. Smooth transitions, consistent spacing, professional typography. The details that make users think "these people know what they're doing."

## Mental Models & Expectations

### Food Delivery Apps (Glovo, Tazz)

Users expect large photos and instant gratification. Coquinate reframes this as "Your week's meals planned" with cooking times instead of delivery times. Clear labeling prevents confusion about ordering vs. planning.

### Banking Apps (George, BT Pay)

Users expect professional polish and transaction-like history. Coquinate delivers with savings balance prominently shown, week history as "meal transactions", and the same trustworthy aesthetic.

### Shopping List Apps

Users expect search, custom categories, and sorting options. Coquinate provides fully customizable categories (not store layouts), multiple sort options, search functionality, and familiar check-off patterns.

## Emotional Journey & Value Proposition

### Core Value Beyond Money

The platform delivers three interconnected values:

1. **Time savings:** 3+ hours weekly on decisions and planning
2. **Financial savings:** Avoid 10-15 delivery orders monthly (~400-600 RON)
3. **Quality control:** {t('value_proposition.quality_control')} - you choose ingredients, control preparation, ensure quality

### Key Emotional Moments

- **Thursday 6 AM:** Relief - "It's planned for me"
- **Shopping:** Control - "I choose the quality"
- **Cooking:** Pride - "Made with my hands"
- **Daily:** Confidence - "No mystery ingredients"

### Savings Display Strategy

- Show ranges not exact amounts: "~400-600 RON"
- Focus on behavior: "You cooked instead of ordering"
- Include quality message: "20 meals made at home"
- Use tangible comparisons: "That's a tank of gas"

## Key UI Requirements (PRD-Aligned)

### Mobile Interactions

- Touch targets: 44px minimum (accessibility)
- Pinch-to-zoom on recipe views (practical for cooking)
- Responsive design for iOS 14+ and Android 10+
- Shopping list search functionality (FR6)

### Feedback System

- Thumbs up/down after meal completion (FR7)
- Quick reason buttons for negative feedback: {t('feedback.too_complicated')}, {t('feedback.takes_too_long')}, {t('feedback.missing_ingredients')}, {t('feedback.didnt_like_it')}
- Optional text field for detailed feedback
- Optimistic UI updates with background sync (FR37)

### Core Navigation

- User-selectable default view: Week or Today (FR32)
- Bottom tab navigation for mobile
- PDF export for shopping lists (FR6)
- Automatic portion scaling for 1-6 people (FR5)

### Visual Feedback

- Skeleton screens matching layout (FR36)
- No generic spinners allowed (FR36)
- Progress indicators for completion tracking
- Clear error states with recovery actions (FR35)

## Pain Point Solutions (PRD-Focused)

### Decision Fatigue Solution

- Thursday 6 AM: {t('notifications.weekly_menu_ready')} notification
- Week view shows all 28 meals immediately
- No decisions needed, just execution

### Evening Panic Solution

- Today view shows current day's 4 meals
- Leftover indicators: {t('meals.leftover_from_day', {day: 'sunday'})} for reheated meals
- Cooking time badges on all meal cards

### Shopping Efficiency Solution

- Complete weekly list with all ingredients
- Search bar for quick finding (FR6)
- Category organization (customizable per FR28)
- PDF export for offline use

### System Notifications (per PRD)

- Thursday 6 AM: Plan ready notification
- Friday 5 PM: Shopping reminder
- Trial ending notice
- Payment failure alerts (within 1 hour per NFR16)

## Success Metrics Definition

### Measurable UX Metrics

**Primary Metrics:**

- **Trial-to-paid conversion:** Target 30% (PRD goal)
- **Weekly meal completion:** >70% meals marked cooked indicates success
- **Shopping list usage:** >80% PDF exports shows value delivery
- **Feedback ratio:** >75% thumbs up validates recipe quality

**Behavioral Indicators:**

- **Week 2 retention:** >60% return after first week
- **Sunday batch completion:** >50% complete Sunday cooking
- **Active cooking weeks:** 3+ weeks/month with >10 meals cooked (North Star)

**Failure Signals:**

- Week 1 churn: Onboarding failed
- <30% Sunday completion: Batch cooking unrealistic
- <10% trial conversion: Value not perceived

### What We Cannot Measure

- Actual time saved (we estimate, not track)
- Actual money saved (no delivery spending baseline)
- Stress reduction (subjective)
- Decision fatigue improvement (unmeasurable)

**Note:** Success proxied through behavior (cooking completion) not claimed benefits (time/money saved).

## Admin Dashboard UI Patterns (PRD-Aligned)

**Multiple Admin Support:** All admin accounts have identical permissions - no role hierarchy or permission restrictions. All admins can access all features and make all changes.

### Navigation & Status

- Tab-based navigation: Recipes | Meal Plans | Validation | Analytics | Settings
- Status bar showing current week, deadline (Wednesday 2 PM), validation status
- Quick actions: Clone Last Week, Emergency Override buttons
- Auto-save indicator with visual confirmation after each action

### Meal Plan Builder

- 7-day × 4-meal visual grid layout
- Drag-and-drop recipes from sidebar to meal slots
- Visual leftover flow arrows between connected meals
- Duplicate recipe warnings
- Undo/redo for last 20 actions

### Validation System

- Traffic light status: Red (blocking), Yellow (warning), Green (pass)
- Blocking errors prevent publish unless emergency override
- Override requires typed confirmation: "OVERRIDE AND PUBLISH"
- One-click fix suggestions for common issues

### AI Integration

- AI Suggest button for meal recommendations
- Preview suggestions before applying to grid
- No automatic changes - admin reviews and approves
- Fallback to manual mode if AI unavailable

### Testing Mode

- Preview recipes as they appear to users
- Device simulator for mobile/desktop views
- Household scaling verification (1-6 people)
- "Test Passed" flag required before publishing

## Change Log

| Date       | Version | Description                                                                                                                                                                                                               | Author            |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 2025-01-10 | 1.0     | Initial UI/UX specification creation                                                                                                                                                                                      | Sally (UX Expert) |
| 2025-01-10 | 1.1     | Added mental models and shopping list interface design                                                                                                                                                                    | Sally (UX Expert) |
| 2025-01-10 | 1.2     | Added emotional journey mapping and savings UI components                                                                                                                                                                 | Sally (UX Expert) |
| 2025-01-10 | 1.3     | Added user scenarios and PRD-aligned UI requirements                                                                                                                                                                      | Sally (UX Expert) |
| 2025-01-10 | 1.4     | Stripped scope creep, aligned strictly with PRD requirements                                                                                                                                                              | Sally (UX Expert) |
| 2025-01-10 | 1.5     | Added honest success metrics definition                                                                                                                                                                                   | Sally (UX Expert) |
| 2025-01-10 | 1.6     | Added admin persona and PRD-aligned dashboard UI patterns                                                                                                                                                                 | Sally (UX Expert) |
| 2025-01-10 | 2.0     | Added Information Architecture with corrected scope                                                                                                                                                                       | Sally (UX Expert) |
| 2025-01-10 | 2.1     | Added Wireframes & Mockups section with critical UX patterns                                                                                                                                                              | Sally (UX Expert) |
| 2025-01-10 | 2.2     | Added complete ASCII wireframes for all main screens                                                                                                                                                                      | Sally (UX Expert) |
| 2025-01-10 | 2.3     | Added corrected additional wireframes (Recipe Detail, Feedback, Previous Week)                                                                                                                                            | Sally (UX Expert) |
| 2025-01-10 | 2.4     | Added validated system wireframes (Loading, Error, Onboarding, Empty States, Notifications) with PRD compliance                                                                                                           | Sally (UX Expert) |
| 2025-01-10 | 2.5     | Added remaining Admin wireframes (Recipe Management, Validation, Analytics, Emergency)                                                                                                                                    | Sally (UX Expert) |
| 2025-01-10 | 2.6     | Added remaining User wireframes (Subscription, Billing, Meal History, Trial Recipes)                                                                                                                                      | Sally (UX Expert) |
| 2025-01-10 | 2.7     | Enhanced Recipe Management with OpenFoodFacts integration, added Ingredient Database Lookup and Recipe Import/Lookup interfaces                                                                                           | Sally (UX Expert) |
| 2025-01-10 | 2.8     | Added missing critical wireframes: User Settings, Payment/Checkout Flow, Vacation Mode, Shopping List PDF Export                                                                                                          | Sally (UX Expert) |
| 2025-01-10 | 2.9     | Added Recipe Cooking Assistant, Payment Failure Recovery, Admin Settings Tab, and Visual Leftover Flow Connections wireframes                                                                                             | Sally (UX Expert) |
| 2025-01-10 | 3.0     | Converted all admin interfaces to Romanian, added nutritional information displays to Recipe Detail and Today View, added nutrition fields to Recipe Creation form, fixed language consistency throughout                 | Sally (UX Expert) |
| 2025-01-10 | 3.1     | Added Coming Soon page and complete Presentation Website wireframes (7 sections + mobile view), all content in Romanian per PRD requirements                                                                              | Sally (UX Expert) |
| 2025-01-10 | 3.2     | Added Chef AI assistant feature: interactive chat interface, floating button, context-aware tips. Updated presentation site to highlight AI as key differentiator. Removed "rețete românești moderne" claims per feedback | Sally (UX Expert) |
| 2025-01-10 | 3.3     | Added complete presentation website structure: Sample Menu page, Pricing page, Blog section, Contact page, Auth pages (login/signup flow), Footer, Mobile menu - all per PRD and Site Map requirements                    | Sally (UX Expert) |
