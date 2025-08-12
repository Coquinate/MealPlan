# Next Steps

## UX Expert Prompt

To initiate UX design for Coquinate, use the following prompt with the UX Expert agent:

"Please create the comprehensive UX design for Coquinate meal planning platform using the PRD at docs/prd.md. Focus on: 1) Mobile-first responsive design for the user app with Week View and Today Focus interfaces, 2) Desktop-optimized admin dashboard with drag-drop meal plan builder and visual leftover flows, 3) Marketing website with strong conversion focus and Romanian cultural relevance. Prioritize the 3-day trial experience flow and shopping list interactions. Design system should use Tailwind v4 semantic tokens with clean, modern aesthetics - no folk patterns. Deliver high-fidelity mockups for critical user journeys."

## Architect Prompt

To initiate architecture design for Coquinate, use the following prompt with the Architect agent:

"Please create the technical architecture for Coquinate meal planning platform using the PRD at docs/prd.md. Design a monorepo structure with pnpm workspaces, Supabase backend (PostgreSQL + Auth + Edge Functions + native SQL DDL for database management), and Vercel hosting. Implement Vercel AI SDK with Gemini 2.5 Flash for recipe/plan generation with multi-layer caching. Focus on: 1) Serverless architecture with <500ms API responses, 2) Comprehensive admin dashboard testing (90%+ coverage), 3) Stripe payment integration with Romanian RON support, 4) PWA with offline capabilities. Follow KISS principle - no overengineering. Deliver complete technical specifications ready for implementation."

## Newsletter Structure (Non-Subscribers)

**Weekly Newsletter - Sent Fridays:**

- Subject lines rotate: tips, recipes, savings stories
- Content blocks:
  1. One complete recipe from the week
  2. Batch cooking tip or time-saving hack
  3. Seasonal ingredient spotlight
  4. Customer story or testimonial (real or crafted)
  5. Soft CTA to start trial
- Footer: Unsubscribe, why receiving this
- Keep under 500 words for mobile reading

## Analytics Events to Track

**Conversion Funnel:**

- Homepage viewed, CTA clicked
- Registration started, completed, abandoned (with step)
- Trial started, day 2 active, day 3 active
- Trial converted to paid, trial expired
- Subscription cancelled (with reason if provided)

**User Engagement:**

- Meal viewed, marked as cooked
- Shopping list viewed, exported, items checked
- Feedback given (thumbs up/down)
- Settings changed (household size, menu type)
- PWA installed

**Business Metrics:**

- Weekly active users (WAU)
- Meals cooked per user per week
- Shopping list usage rate
- Trial-to-paid conversion rate
- Churn rate and reasons
- Payment failures and recovery

**Technical Performance:**

- Page load times (Core Web Vitals)
- API response times
- Error rates by type
- Offline usage patterns
- Device/browser breakdown

## Pricing Structure

**Subscription Options:**

- Monthly: 50 RON/month (cancel anytime)
- Annual: 550 RON/year (save 50 RON, equals 45.83 RON/month)
- Both plans include identical features
- 3-day free trial for both (no credit card required)

**Refund Policy:**

- Monthly: Full refund if cancelled within 7 days
- Annual: Full refund if cancelled within 30 days
- After refund period: No refunds but can pause for vacation

**Billing Details:**

- Payment via Stripe (Visa, Mastercard, PayPal)
- Failed payment: 3 retry attempts over 7 days
- Automatic renewal on same date each period
- Upgrade from monthly to annual anytime (prorated)
- Downgrade only at renewal period
