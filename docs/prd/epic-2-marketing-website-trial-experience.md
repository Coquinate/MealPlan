# Epic 2: Marketing Website & Trial Experience

**Epic Goal:** Build the complete marketing website that converts visitors into trial users, including the 3-day trial experience with the curated showcase menu. This epic delivers the primary customer acquisition funnel.

## Story 2.1: Coming Soon Landing Page (Production)

**As a** potential customer,  
**I want** to discover Coquinate before launch,  
**so that** I can be notified when it's available.

**Acceptance Criteria:**

1. Single compelling page at production domain (coquinate.ro)
2. Hero: "Gata cu 'Ce gătim azi?'" with subtitle about saving 3+ hours weekly
3. Brief explanation of service (3-4 benefit points with icons)
4. Email capture form for launch notification
5. "Launching Soon" without specific date
6. Animated meal carousel or interactive element for engagement
7. Store emails in database for launch announcement
8. Auto-response confirming subscription
9. Mobile-responsive with fast load time
10. Can deploy immediately while developing full site

## Story 2.2: Homepage with Value Proposition

**As a** visitor,  
**I want** to understand Coquinate's value within 10 seconds,  
**so that** I decide whether to explore further.

**Acceptance Criteria:**

1. Hero section with "Gata cu 'Ce gătim azi?'" headline
2. Subheadline showing time/money savings (3+ hours, 300 RON)
3. Primary CTA "Start 3-Day Free Trial" above the fold
4. Problem agitation section with relatable pain points
5. Interactive week preview grid (expandable Wednesday)
6. 3 mock testimonials from Romanian families
7. Value comparison visual (600 RON delivery vs 50 RON Coquinate)
8. Mobile-responsive with proper touch targets (44px minimum)

## Story 2.2: Sample Menu Showcase Page

**As a** visitor,  
**I want** to see exactly what meals I'll receive,  
**so that** I trust the quality before signing up.

**Acceptance Criteria:**

1. Full Wednesday menu with 4 complete recipes displayed
2. Visual meal cards with photos and cooking times
3. Batch cooking labels ("Made Sunday", "Reheated", etc.)
4. Shopping list preview for Wednesday
5. Downloadable PDF of Wednesday's menu
6. Time breakdown showing 4-5 cooking sessions = 30 meals
7. Clear CTA to start trial after seeing value

## Story 2.3: Pricing Page

**As a** visitor,  
**I want** to understand pricing and what's included,  
**so that** I can make an informed decision.

**Acceptance Criteria:**

1. Single plan displayed: 50 RON/month
2. Annual option shown: 550 RON/year (save 50 RON)
3. Feature list clearly displayed
4. FAQ section with 5-6 common questions
5. Comparison with delivery costs (visual calculator)
6. Refund policy clearly stated
7. Multiple CTAs to start free trial

## Story 2.4: Registration Flow

**As a** visitor,  
**I want** to sign up quickly without friction,  
**so that** I can start my trial immediately.

**Acceptance Criteria:**

1. Google OAuth one-click signup (primary option)
2. Email/password alternative with 8+ char requirement
3. Step 2: Household size selector (1-6 people)
4. Step 3: Menu type selection (Omnivore/Vegetarian)
5. Terms acceptance checkbox
6. "No credit card required" prominently displayed
7. Immediately redirect to trial menu after signup
8. Welcome email sent with trial information

## Story 2.5: 3-Day Trial Menu Experience

**As a** trial user,  
**I want** to experience the core value immediately,  
**so that** I understand what I'm paying for.

**Acceptance Criteria:**

1. Special curated 3-day menu (best recipes) displayed
2. Full functionality: mark cooked, generate shopping list, export PDF
3. Banner showing "Day X of 3 - Upgrade to Continue"
4. All recipes remain visible after trial (read-only gift)
5. Cannot access other weeks or features
6. Upgrade CTA present but not intrusive
7. Trial expiry countdown timer visible

## Story 2.6: Blog Structure & Initial Content

**As a** visitor,  
**I want** useful meal planning content,  
**so that** I trust Coquinate's expertise.

**Acceptance Criteria:**

1. Blog index page with article grid
2. Individual article template with table of contents
3. 3 launch articles written and published (reduced from 5)
4. SEO optimization (meta tags, Open Graph)
5. Newsletter signup in sidebar
6. Social sharing buttons
7. Related articles shown at bottom

## Story 2.7: Legal Pages & Cookie Consent

**As a** visitor,  
**I want** transparent legal information,  
**so that** I trust the service with my data.

**Acceptance Criteria:**

1. Terms of Service page with all required sections
2. Privacy Policy (GDPR compliant)
3. Cookie consent banner (essential + analytics)
4. Romanian language for all legal content
5. Company details (CUI) displayed
6. Contact information for data requests
7. Consent preferences saved in localStorage

## Story 2.8: PDF Export Setup

**As a** user,  
**I want** to export shopping lists as PDF,  
**so that** I can print or save them offline.

**Acceptance Criteria:**

1. Client-side PDF library integrated (jsPDF or similar)
2. PDF template for shopping list with Coquinate branding
3. PDF generation works offline (client-side only)
4. A4 and Letter size formats supported
5. Romanian characters display correctly
6. Include meal plan summary option
7. Minimal Vercel Analytics for page views only (free tier)

## Story 2.9: Contact & Support Form

**As a** user,  
**I want** to contact support easily,  
**so that** I can get help when needed.

**Acceptance Criteria:**

1. Simple contact form at /contact
2. Pre-filled with user email if logged in
3. Category selection (payment, technical, content)
4. Sends to support@coquinate.ro
5. Auto-response confirming receipt
6. Rate limiting (max 5 per hour per IP)
7. Support response time expectation set (24-48h)
