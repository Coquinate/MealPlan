# Epic 6: Email Automation

**Epic Goal:** Set up essential email communications to guide users from trial to subscription and keep them engaged with timely notifications about their meal plans.

## Story 6.1: Email Service Setup

**As a** developer,  
**I want** basic email service configured,  
**so that** automated emails work reliably.

**Acceptance Criteria:**

1. SendGrid or Resend API integration
2. Domain authentication (SPF, DKIM)
3. Email templates with Coquinate branding
4. Romanian language for all templates
5. Unsubscribe links where required by law
6. Test mode for development environment

## Story 6.2: Trial & Nurture Emails

**As a** trial user,  
**I want** helpful emails during and after trial,  
**so that** I understand the value and convert to paid.

**Acceptance Criteria:**

1. Day 0: Welcome email with quick tips
2. Day 2: Engagement check and feature highlights
3. Day 3: Trial ending reminder with gift message
4. Days 4, 7, 14, 21, 30: Post-trial nurture sequence
5. All emails from "Maria de la Coquinate" with personal tone
6. Stop sending after Day 30 unless newsletter subscriber

## Story 6.3: Subscription Notifications

**As a** paying user,  
**I want** timely meal plan notifications,  
**so that** I stay organized with my cooking.

**Acceptance Criteria:**

1. Wednesday 6 PM: "New plan tomorrow" preview (per FR3)
2. Thursday 6 AM: "Your week is ready!" with link (per FR3)
3. Friday 5 PM: Shopping reminder (per NFR12)
4. User can opt-out of notifications in settings
5. All times in Romanian timezone

## Story 6.4: Payment Emails

**As a** user,  
**I want** payment confirmations and alerts,  
**so that** I can track my subscription status.

**Acceptance Criteria:**

1. Payment successful receipt (per FR25)
2. Payment failed notification within 1 hour (per NFR16)
3. Subscription renewed confirmation
4. Subscription cancelled confirmation
5. Refund processed notification
6. All emails include transaction details and support contact

## Story 6.5: Weekly Newsletter

**As a** non-subscriber,  
**I want** weekly recipe content,  
**so that** I stay engaged with Coquinate.

**Acceptance Criteria:**

1. Send every Friday with one complete recipe
2. Include batch cooking tip or time-saving hack
3. Under 500 words for mobile reading
4. Newsletter signup form in website footer
5. Unsubscribe link in all newsletters
6. Separate from transactional emails
