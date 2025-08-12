# Marketing Website Requirements

## Overview

The marketing website is integrated into the main application routes, serving as the public-facing entry point that converts visitors into trial users. No separate domain or deployment - just public routes within the app. Keep it simple, honest, and focused on showing the actual product value.

## Core Pages & Structure

**Homepage (/):**

- Hero section: "Stop asking 'Ce gătim azi?'" with clear value props
- Time savings claim: "Save 3+ hours weekly on meal decisions"
- Cost comparison: "Save 200-400 RON vs delivery apps"
- Full Wednesday meal plan showcase with complete recipes and photos
- 3-4 realistic mock testimonials from Romanian families
- Clear pricing: 50 RON/month with "Try 3 Days Free - No Card Required" CTA
- Newsletter signup in footer
- Trust elements: Secure payments badge, no credit card for trial

**Pricing Page (/pricing):**

- Single plan: 50 RON/month
- What's included: Full weekly plans, shopping lists, batch cooking guides
- Simple comparison with typical delivery costs
- FAQ section (5-6 common questions)
- Clear CTA to start trial

**Blog (/blog):**

- SEO-optimized for Romanian cooking searches
- Launch with 5-10 practical articles (batch cooking, meal prep, Romanian recipes)
- Simple markdown files in repo (no CMS)
- Basic sharing buttons

**Sample Menu (/menu-example):**

- Full week preview (meal names for all 7 days)
- Wednesday's complete meal plan with recipes as PDF download
- "Start Your Free Trial" CTA

**Legal Pages:**

- Terms of Service (/terms)
- Privacy Policy (/privacy)
- Cookie notice (simple banner)

## Navigation Header

- Logo (links to homepage)
- Menu Example
- Pricing
- Blog
- Login
- Start Free Trial (primary CTA button)

## Footer

- Newsletter signup
- Contact email
- Legal links (Terms, Privacy)
- Copyright notice

## Technical Implementation

- Same React/TypeScript stack as main app
- Static generation for marketing pages
- Romanian language primary (structure ready for English)
- Basic SEO meta tags and Open Graph
- Mobile-first responsive design
- Fast load times (<2s on 4G)
- No complex integrations or third-party tools for MVP

## Content Requirements

- 10-15 real meal photos (one photo shoot)
- 3-4 realistic mock testimonials
- 5-10 useful blog posts
- Wednesday's full meal plan formatted
- Basic design consistency with app

## What We're NOT Doing (MVP)

- No fake user counters or city-specific data
- No WhatsApp or social media integrations
- No referral system
- No A/B testing
- No exit intent popups
- No complex analytics (just basic page views)

## Route Structure

**Marketing Routes (Static Generated):**

- `/` → Homepage with full sales pitch
- `/menu` → Sample Wednesday menu showcase
- `/pricing` → Pricing page
- `/blog` → Blog index
- `/blog/[slug]` → Individual blog posts
- `/legal/terms` → Terms of Service
- `/legal/privacy` → Privacy Policy

**Auth Routes:**

- `/login` → Login (social + email)
- `/signup` → Register (social + email)
- `/reset-password` → Password reset

**App Routes (Protected):**

- `/app` → Redirects to user's default view
- `/app/meals` → Week view with trial/paid state
- `/app/meals/today` → Today's focus view
- `/app/shopping` → Interactive shopping list
- `/app/settings` → Profile, notifications, preferences
- `/app/billing` → Subscription management

**Admin Routes:**

- `/admin` → Dashboard overview
- `/admin/recipes` → Recipe management with bulk import
- `/admin/plans` → Meal plan builder with validation
- `/admin/analytics` → User metrics and feedback

**Error Pages:**

- `/404` → User-friendly not found
- `/500` → Server error with support info
- `/maintenance` → Planned downtime notice

## Trial Experience Flow

**Active Trial (Days 1-3):**

- Full access to 3-day curated menu
- Can mark meals as cooked, generate shopping lists, export PDFs
- Banner shows days remaining with upgrade CTA
- Cannot access other weeks or meal history

**Expired Trial (Day 4+):**

- Recipes remain visible forever as a gift
- Read-only mode with disabled interactions
- Persistent but non-aggressive upgrade prompts
- Account remains active for eventual conversion

## Email Sequences

**Trial Active (Days 0-3):**

- Day 0: Welcome email with quick tips
- Day 2: Engagement check and reminder
- Day 3: Last day notice with gift message

**Trial Expired (Days 4-30):**

- Day 4: Soft expiry with value proposition
- Day 7: Time savings testimonial
- Day 14: Recipe teaser with new features
- Day 21: Local social proof
- Day 30: Final offer with discount

**Ongoing Communications:**

- Weekly newsletter with free recipe and tips (Fridays)
- Plan ready notification (Thursday 6 AM)
- Shopping reminder (Friday 5 PM)
- Payment and subscription status updates

All emails sent from "Maria de la Coquinate" with personal, value-focused tone in Romanian.

## Homepage Content Structure

**Hero Section:**

- Headline: "Gata cu 'Ce gătim azi?'"
- Subheadline: "Primești meniuri complete pentru toată săptămâna. Economisești 3+ ore și 300 RON lunar."
- Primary CTA: "Start 3-Day Free Trial" with "No credit card required" subtext
- Hero image: Romanian dishes on family table

**Problem Agitation Section:**

- Pain points: Decision fatigue, multiple shopping trips, expensive delivery, food waste, evening stress
- Relatable scenarios with emoji icons

**Solution Preview:**

- Interactive week grid (Monday-Sunday)
- Expandable Wednesday showcase with full meal details
- Download shopping list option
- Recipe preview functionality

**How It Works (3 Steps):**

1. PRIMEȘTI - Thursday morning menu delivery
2. CUMPERI - One shopping trip or online order
3. GĂTEȘTI - Sunday batch cooking + quick weekday meals

**Social Proof:**

- 3 mock testimonials from Romanian families
- Star ratings and specific benefits mentioned
- Names and cities for authenticity

**Value Comparison:**

- Without Coquinate: 600 RON + 20 hours wasted
- With Coquinate: 50 RON/month, everything planned
- Clear cost-benefit visualization

**Pricing Section:**

- Two options: Monthly (50 RON) and Annual (550 RON - save 50 RON)
- Feature checklist for both plans
- Clear trial offer emphasis
- Annual positioned as better value

**FAQ Section:**

- 5-6 common objections addressed
- Expandable accordion format
- Simple, honest answers

**Final CTA:**

- Urgency messaging about joining other families
- Restate trial benefits
- Gift messaging (recipes yours forever)

**Footer:**

- Newsletter signup for weekly free menu
- Essential links (Blog, Pricing, Legal)
- Contact email: maria@coquinate.ro

## Menu Sample Page Structure

**Page Purpose:**
Show a complete Wednesday menu with actual recipes to demonstrate value. Focus on batch cooking efficiency - you cook 4-5 times but eat 30 days.

**Content Layout:**

- Week preview grid (all 7 days teaser)
- Wednesday full menu showcase with 4 complete recipes
- Time breakdowns emphasizing batch cooking (5 min reheated lunch from Sunday's batch)
- Shopping list preview for Wednesday
- Nutritional snapshot

**Batch Cooking Emphasis:**

- Clear labeling: "Made Sunday", "Reheated", "Cook for 2 days"
- Monthly pattern view: 4 Sundays × 2h batch + sporadic fresh cooking = 20h/month
- Seasonal variations in cooking patterns
- Flexibility explanations for missed batch days

**Time Reality:**

- Weekly: ~4 hours actual cooking (not daily)
- Pattern: Sunday 2h batch, 2-3 evenings 30min fresh, rest just reheat
- Monthly: 18-20 hours total vs 60+ without planning

**CTA Focus:**
"Cook 4-5 times, eat 30 days" - emphasis on batch cooking intelligence, not daily cooking

## Error Pages

**404 - Not Found:**

- Friendly message in Romanian
- Links to main pages (menu, pricing, home)
- Contact email for help
- Simple and helpful

**500 - Server Error:**

- Apologetic tone
- Clear next steps (retry, clear cache)
- Contact options (email, WhatsApp)
- Auto-notification to tech team mentioned

**403 - Forbidden:**

- Login/Register CTAs
- Explanation of possible causes
- Support contact

**Maintenance Page:**

- Expected return time
- Alternative actions (download PDF, check email)
- Updates contact

**Payment Failed:**

- Common causes listed
- Clear retry options
- Order number for support
- Multiple payment method suggestion

**Trial Expired (Soft):**

- Gift messaging (keep 3-day recipes)
- Upgrade CTA
- Show what they're missing

**Subscription Cancelled:**

- Confirmation with end date
- Content remains accessible
- Easy reactivation
- Feedback request

Design Principles:

- Friendly Romanian tone ("tu" not "dumneavoastră")
- Always include: what happened, what to do, how to get help
- No technical jargon or blame
- Centered, mobile-responsive design
- Track errors for improvement

## Blog Strategy

**Initial Articles (5-10 for launch):**

1. "Cum să gătești pentru toată săptămâna în 2 ore" - batch cooking guide
2. "De ce comandăm mâncare de 3 ori pe săptămână (și cum să oprim)" - cost analysis
3. "Ciorbă de burtă: 1 oală, 3 zile de prânzuri" - recipe showcase
4. "Lista de cumpărături perfectă pentru familie" - free template
5. "Mic dejun în 10 minute: 5 idei pentru dimineți grăbite" - quick recipes
6. "Sarmale făcute duminică, mâncate toată săptămâna" - batch strategy
7. "Cum să transformi resturile în mese noi" - leftover creativity
8. "Cât costă să gătești acasă vs. delivery" - calculator
9. "Plictisit de aceleași 5 mâncăruri?" - variety strategies
10. "Ghidul începătorului pentru meal prep (ediția România)" - complete guide

**Blog Design:**

- Index: Featured post + 3-column grid of recent posts
- Post layout: 2-column with article + sticky sidebar
- Sidebar: Table of contents, email capture, trial CTA
- Mobile: Single column, collapsible sections
- Typography: 16px minimum, good line height
- Images: Hero 16:9, thumbnails 4:3, lazy loading
- Components: Recipe cards, email capture boxes, share buttons
- Reading progress bar at top
- Related posts at bottom

**SEO & Distribution:**

- 800-1200 words per post
- Target 1-2 keywords each
- Real photos, not stock
- Schema markup for recipes
- Share in Romanian Facebook groups
- Weekly newsletter repurposing

## SEO Strategy

**Target Keywords:**

- Primary: "meal planning România", "meniu săptămânal familie", "ce gătim azi"
- Problem-aware: "economisit bani mâncare", "batch cooking România"
- Local: "meniuri familie București", "meal prep Cluj"

**Technical SEO Implementation:**

- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Next.js 14 App Router with metadata API
- Structured data: Organization, Recipe, FAQ schemas
- Image optimization: WebP/AVIF, responsive sizes, lazy loading
- Clean URLs in Romanian (no parameters)
- XML sitemap auto-generated
- Robots.txt with crawl directives
- Security headers (HSTS, CSP, X-Frame-Options)
- Resource hints: dns-prefetch, preconnect, preload
- Performance monitoring for Web Vitals

**Competition Analysis:**

- Direct: Georgiana Ilie (newsletter, 21k subscribers), Savori Urbane (recipe blog)
- Indirect: HelloFresh (250+ RON/week), Food delivery (800+ RON/month)
- Opportunity: "meal prep România", "batch cooking" keywords unclaimed
- Defense: Move fast, SEO land grab, build local partnerships

**On-Page Optimization:**

- Title tags with keywords and brand
- Meta descriptions with CTAs
- H1-H6 hierarchy properly structured
- Alt text for all images in Romanian
- Internal linking between related content
- Canonical URLs to prevent duplicates
- Hreflang tags for future English version

## Registration Flow

**Step 1: Initial Signup (/signup)**

- Social auth: Google only (no Facebook)
- Email + password alternative
- Password: min 8 chars, 1 number
- Must accept terms checkbox
- "No credit card required" visible

**Step 2: Household Setup (/signup/preferences)**

- Household size: 1-6 people (buttons)
- Include kids: Yes/No toggle
- Menu type: Omnivore/Vegetarian radio
- No delivery time question (Thursday 6 AM fixed)
- Newsletter opt-in checkbox

**Step 3: Success & Direct Access (/app/week)**

- Direct redirect to Week View Dashboard with trial menu loaded
- Progressive feature discovery through contextual tooltips
- Direct to trial menu
- First-day tip highlighted

**Mobile Optimizations:**

- Single column layout
- 44px minimum touch targets
- Number pad for appropriate inputs
- Password visibility toggle
- Progress bar visible

**Friction Reduction:**

- Social auth prominent (Google)
- Minimal required fields
- No email verification for trial
- Clear progress indicators
- Partial progress saved in localStorage

**Post-Registration:**

- Welcome email sent immediately
- Trial starts instantly
- Access to 3-day menu
- No payment method required

## Legal Pages

**Terms of Service (/legal/terms):**
Key sections to include:

1. Service description (meal planning subscription)
2. Registration requirements (18+, one account per family)
3. Trial terms (3 days free, recipes kept forever)
4. Pricing (50 RON/month or 550 RON/year, auto-renewal)
5. Cancellation (anytime, refund windows specified)
6. Intellectual property (recipes for personal use only)
7. Liability limitations (not medical advice, check allergies)
8. Account termination conditions
9. Modification notices (30 days for major changes)
10. Company details (CUI, contact info)

**Privacy Policy (/legal/privacy):**
GDPR-compliant sections:

1. Data collected (account, usage, technical)
2. Purpose of processing (service delivery, improvements)
3. Third parties (Stripe, SendGrid, Vercel, Supabase)
4. Security measures (SSL, bcrypt, restricted access)
5. User rights (access, rectification, erasure, portability)
6. Cookie policy (essential + optional analytics)
7. Data retention (active use + 90 days, financial 5 years)
8. Children policy (no under-16 intentionally)
9. DPO contact (privacy@coquinate.ro)
10. Supervisory authority (ANSPDCP România)

**Cookie Banner:**

- Simple consent UI
- Essential cookies always active
- Analytics only after consent
- Preference stored in localStorage
- Link to privacy policy details

**Compliance Checklist:**

- GDPR: consent, rights, security, privacy by design
- Romanian law: Romanian language, CUI displayed, TVA included
- Consumer protection: 30-day refund (exceeds 14-day requirement)
