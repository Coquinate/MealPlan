# User Interface Design Goals

## Overall UX Vision

Minimalist, efficiency-focused meal planning for busy urban professionals. Clean, modern interface prioritizing speed and convenience over decoration. Think Revolut meets meal planning - get in, get your plan, get out.

## Key Interaction Paradigms

- **Streamlined onboarding** - 3 steps to immediate meal plan access
- **Card-based browsing** - Visual meal cards with time/difficulty badges and state indicators
- **One-tap actions** - Mark cooked, thumbs up/down, check shopping items
- **Smart defaults** - Pre-configured for typical urban family patterns
- **Simple access** - PWA optional for offline, PDF export as fallback

## Core Screens and Views

- **Registration Flow** (Sub-2-minute):
  - Step 1: Email/password or social auth
  - Step 2: Household size (1-6 people selector)
  - Step 3: Menu type (Omnivore/Vegetarian toggle)
  - Immediately show 3-day trial menu
- **Post-Registration Flow** (Direct value delivery):
  - Immediately redirect to Week View Dashboard with trial menu
  - No forced tutorial screens - users discover features naturally
  - Optional onboarding tooltips appear on first interaction with features
  - Focus on immediate value delivery rather than explanation
- **Week View Dashboard** - Default primary view showing full weekly meal plan with today highlighted, completion status per day, time savings banner ("You're saving 3+ hours this week!"), cooking streak counter
- **Today Focus** - Quick access to today's meals with cooking instructions (users can set as default in settings)
- **Meal Detail View** - Recipe card with instructions, cooking timer, portion scaling
- **Interactive Shopping List** - Category-sorted with search function, customizable categories, alphabetical option, PDF export and email delivery
- **Trial Expired View** - Meal names visible but recipes locked, shows "You saved 45 minutes in just 3 days! Continue saving 3+ hours every week - Subscribe to unlock"
- **Settings** - Household size, menu type, default view (Week/Today), vacation mode
- **Subscription Management** - Billing, pause, cancel

## Accessibility

WCAG AA compliance for inclusive access

## Branding

Urban modern - clean whites, single accent color, sans-serif typography, high-quality food photography. No folk patterns or traditional elements. Tech-forward, not nostalgic.

## Target Platforms

Mobile-first PWA (85% mobile usage expected), with responsive web for desktop

## Critical UI States

**Error States:**

- **No Meal Plan Available:** "Plans arrive every Thursday at 6 AM" with countdown timer
- **Network Error:** "You're offline - Check connection" with retry button and offline-capable features highlighted
- **Payment Failed:** Clear error message with retry option, support contact, prevents account suspension panic
- **404/Not Found:** Friendly message with navigation back to Week View

**Loading States:**

- **Initial Load:** Skeleton screens matching layout structure (not generic spinners)
- **Image Loading:** Blurred placeholder → full image (progressive enhancement)
- **Action Feedback:** Optimistic UI updates (mark cooked immediately, sync later)
- **Plan Generation:** Progress indicator for admin dashboard operations

**Empty States:**

- **No Meals Cooked Yet:** Encouraging message "Start your meal planning journey!"
- **Trial Not Started:** Clear CTA to begin 3-day trial
- **Between Plans:** "New plan arrives in X hours" with last week still visible
