# Epic 5: Subscription & Payment System

**Epic Goal:** Implement complete payment processing and subscription management, enabling monetization through monthly and annual plans with Stripe integration.

## Story 5.1: Stripe Integration Setup

**As a** developer,  
**I want** Stripe properly integrated,  
**so that** we can process payments securely.

**Acceptance Criteria:**

1. Stripe SDK integrated in monorepo
2. Webhook endpoints configured for Stripe events
3. Test mode and production mode setup
4. Environment variables for Stripe keys
5. PCI compliance maintained (no card data stored)
6. Romanian currency (RON) configured
7. Error handling for Stripe API failures
8. Webhook signature verification

## Story 5.2: Subscription Plans Configuration

**As a** product owner,  
**I want** subscription plans configured in Stripe,  
**so that** users can choose monthly or annual billing.

**Acceptance Criteria:**

1. Monthly plan: 50 RON/month (per FR18)
2. Annual plan: 550 RON/year (save 50 RON) (per FR18)
3. Both plans give identical features
4. Recurring billing configured
5. Trial period NOT attached to subscription (separate)
6. Plans created in Stripe dashboard
7. Price IDs stored in environment variables

## Story 5.3: Payment Flow Implementation

**As a** trial user,  
**I want** to upgrade to paid subscription,  
**so that** I can continue using Coquinate.

**Acceptance Criteria:**

1. Upgrade button triggers Stripe Checkout
2. Support cards (Visa/Mastercard) and PayPal (per FR23)
3. Secure redirect to Stripe hosted page
4. Success redirect to app with confirmation
5. Cancel redirect back to pricing
6. Immediate access to current week (per FR26)
7. Receipt email sent automatically (per FR25)
8. Payment completes within 3 seconds (per NFR14)

## Story 5.4: Subscription Management Interface

**As a** paying user,  
**I want** to manage my subscription,  
**so that** I have control over my payments.

**Acceptance Criteria:**

1. View current plan (monthly/annual)
2. Next billing date displayed
3. Update payment method via Stripe
4. Cancel subscription flow (per FR20)
5. Immediate access through billing period after cancel
6. Upgrade from monthly to annual (prorated)
7. Downgrade only at renewal
8. Self-service through dashboard (per FR22)

## Story 5.5: Vacation Mode (Pause Subscription)

**As a** user,  
**I want** to pause my subscription,  
**so that** I don't pay while on vacation.

**Acceptance Criteria:**

1. Pause for up to 4 weeks (per FR19)
2. Read-only access to previous plans during pause
3. Auto-resume after pause period
4. Manual resume option
5. Billing date shifts accordingly
6. Clear indication of paused status
7. Cannot pause if already paused

## Story 5.6: Payment Failure Handling

**As a** system,  
**I want** to handle payment failures gracefully,  
**so that** users aren't immediately cut off.

**Acceptance Criteria:**

1. Retry logic: 3 attempts over 7 days (per FR24)
2. Email notification within 1 hour (per NFR16)
3. In-app banner about payment issue
4. Grace period before suspension
5. Update payment method prompt
6. Account suspended after final failure
7. Easy reactivation upon payment

## Story 5.7: Refund Processing

**As a** user,  
**I want** to request refunds per policy,  
**so that** I'm protected if unsatisfied.

**Acceptance Criteria:**

1. Monthly: Full refund within 7 days (per FR21)
2. Annual: Full refund within 30 days (per FR21)
3. Refund request through support email
4. Process refund via Stripe dashboard
5. Account remains active until period end
6. Refund confirmation email sent

## Story 5.8: Billing History & Invoices

**As a** user,  
**I want** to access my billing history,  
**so that** I can track expenses and get invoices.

**Acceptance Criteria:**

1. List of all transactions
2. Download PDF invoices
3. Romanian invoice format (CUI included)
4. VAT properly calculated
5. Company details editable for business users
6. Email receipts for all transactions (per FR25)
7. Export to CSV for accounting

## Story 5.9: Subscription Analytics (Simplified)

**As a** product owner,  
**I want** to track key subscription metrics,  
**so that** I can monitor business health.

**Acceptance Criteria:**

1. Use Stripe Dashboard for most metrics (MRR, churn, revenue)
2. Database query for active subscriber count
3. Trial to paid conversion rate (simple calculation)
4. Weekly summary email with key metrics
5. Export subscriber list from Stripe
6. Basic admin dashboard showing Stripe data + our metrics

## Story 5.10: Automated Billing Operations

**As a** system,  
**I want** billing to run automatically,  
**so that** subscriptions renew without manual work.

**Acceptance Criteria:**

1. Auto-renewal at 2 AM on billing date (per NFR15)
2. Webhook processing for all Stripe events
3. Database sync with Stripe status
4. Automatic email receipts
5. Failed payment notifications
6. Successful renewal confirmations
7. Timezone handling (Romanian time)

## Story 5.11: GDPR Compliance

**As a** user,  
**I want** control over my personal data,  
**so that** my privacy rights are respected.

**Acceptance Criteria:**

1. Account deletion (soft delete, 30-day recovery)
2. Data export (JSON format with all user data)
3. Consent tracking for marketing emails
4. Right to rectification (edit all personal data)
5. Cookie consent management
6. Data retention policy implementation
7. Anonymization after account deletion

## Story 5.12: Payment Flow Integration Testing

**As a** developer,  
**I want** payment flows thoroughly tested,  
**so that** revenue is never lost.

**Acceptance Criteria:**

1. Stripe webhook integration tests
2. Payment retry logic testing
3. Subscription state machine tests
4. Refund processing tests
5. Mock Stripe for development
6. Test various card decline scenarios
7. Currency conversion testing
8. Invoice generation testing
