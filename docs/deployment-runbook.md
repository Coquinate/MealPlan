# Coquinate Deployment Runbook

**Version:** 1.0  
**Date:** January 11, 2025  
**Target Audience:** Developer/DevOps Engineer  
**Estimated Deployment Time:** 2-3 hours (first time), 30 minutes (subsequent deployments)

## Overview

This runbook provides step-by-step instructions for deploying the Coquinate meal planning platform from scratch. The deployment covers the complete architecture including frontend (React 19), backend (Supabase), external services, and monitoring setup.

## Architecture Summary

- **Frontend**: React 19 with TypeScript, hosted on Vercel
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **External Services**: Stripe (payments), Resend (email), Upstash Redis (cache), Gemini AI
- **Database**: 16-table PostgreSQL schema with Row Level Security (RLS)
- **Applications**: Web App + Admin Dashboard + 11 tRPC Edge Function routers

## Prerequisites

### Required Accounts

- [ ] GitHub account (for repository hosting)
- [ ] Vercel account (for frontend hosting)
- [ ] Supabase account (for backend services)
- [ ] Stripe account (for payment processing)
- [ ] Resend account (for email service)
- [ ] Upstash account (for Redis caching)
- [ ] Google Cloud account (for Gemini AI API)

### Local Development Environment

- [ ] Node.js 20.x or 22.x (18.x is EOL as of April 2025)
- [ ] pnpm 10.14.0+ (required - do not use npm/yarn)
- [ ] Git CLI
- [ ] Code editor (VS Code recommended)
- [ ] Supabase CLI: `npm install -g supabase`

## Phase 1: Account Setup & Service Configuration

### 1.1 Supabase Project Setup

1. **Create New Supabase Project**

   ```bash
   # Navigate to https://supabase.com/dashboard
   # Click "New project"
   # Choose EU-Central (Frankfurt) region for GDPR compliance
   # Set project name: "coquinate-prod"
   # Generate secure database password (save this!)
   ```

2. **Configure Project Settings**
   - Navigate to Settings → General
   - Note down:
     - Project Reference ID
     - Project URL: `https://[PROJECT_REF].supabase.co`
   - Navigate to Settings → API
   - Copy these keys (save securely):
     - `anon` public key
     - `service_role` secret key (never expose client-side!)

3. **Generate Access Token**
   ```bash
   # Navigate to https://supabase.com/dashboard/account/tokens
   # Generate new token with full access
   # Save as SUPABASE_ACCESS_TOKEN
   ```

### 1.2 Stripe Configuration

1. **Create Stripe Account**
   - Set business location: Romania
   - Complete business verification for live payments

2. **Create Products & Price Objects**

   ```bash
   # In Stripe Dashboard → Products
   # Create product: "Coquinate Monthly Subscription"
   # Set price: 50 RON/month, recurring
   # Note the Price ID (starts with price_)
   ```

3. **Configure Webhooks**
   - Go to Developers → Webhooks
   - Add endpoint: `https://[PROJECT_REF].supabase.co/functions/v1/stripe-webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy webhook secret (starts with `whsec_`)

### 1.3 Resend Email Service Setup

1. **Create Resend Account**
   - Navigate to https://resend.com
   - Add and verify sending domain (e.g., `mail.coquinate.ro`)
2. **Generate API Key**
   - Go to API Keys → Create API Key
   - Scope: Full Access (or restrict to Send + Domains)
   - Copy the key (starts with `re_`)

### 1.4 Upstash Redis Setup

1. **Create Upstash Database**
   - Navigate to https://console.upstash.com/
   - Create database in EU region (GDPR compliance)
   - Choose Free tier (sufficient for caching)

2. **Get Connection Details**
   - Copy REST URL: `https://[ID].upstash.io`
   - Copy REST Token

### 1.5 Google AI Studio (Gemini) Setup

1. **Enable Gemini API**
   - Go to https://aistudio.google.com/app/apikey
   - Create new API key
   - Enable "Generative Language API"
   - Copy API key

### 1.6 GitHub Repository Setup

1. **Fork/Clone Repository**

   ```bash
   git clone https://github.com/your-username/coquinate.git
   cd coquinate
   pnpm install
   ```

2. **Environment Configuration**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Edit .env.local with your service keys
   nano .env.local
   ```

## Phase 2: Environment Variable Configuration

### 2.1 Frontend Environment Variables (.env.local)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_ACCESS_TOKEN="sbp_[your-access-token]"
SUPABASE_PROJECT_ID="[PROJECT_REF]"

# Application Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://coquinate.ro"
NEXT_PUBLIC_API_URL="https://[PROJECT_REF].supabase.co/functions/v1"

# Launch Mode Configuration
# Controls site access during different launch phases
# Values: 'coming-soon' | 'full-launch'
NEXT_PUBLIC_LAUNCH_MODE="coming-soon"

# Authentication
NEXTAUTH_SECRET="[generate-32-character-random-string]"
NEXTAUTH_URL="https://coquinate.ro"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# External Services
GEMINI_API_KEY="AIza..."
UPSTASH_REDIS_REST_URL="https://[ID].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[token]"
RESEND_API_KEY="re_..."

# Database URL (for schema deployment)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### 2.2 Vercel Environment Variables

After connecting to Vercel, add these environment variables to the Vercel Dashboard:

**Production Environment Variables:**

- All variables from .env.local above
- Set `NODE_ENV=production`
- Set `NEXT_PUBLIC_APP_URL=https://coquinate.ro`

**Preview Environment Variables:**

- Same as production but with preview URLs
- Set `NODE_ENV=development`

## Phase 3: Database Schema Deployment

### 3.1 Initialize Supabase Locally

```bash
# Initialize Supabase in project
supabase init

# Link to remote project
supabase link --project-ref [PROJECT_REF]

# Pull current schema (should be empty)
supabase db pull
```

### 3.2 Deploy Database Schema

1. **Create Schema Migration File**

   ```bash
   # Create new migration
   supabase migration new initial_schema
   ```

2. **Add Complete Schema** (from architecture.md)

   Edit the created migration file with the complete 16-table schema:

   ```sql
   -- Core Enums
   CREATE TYPE menu_type_enum AS ENUM ('vegetarian', 'omnivore');
   CREATE TYPE subscription_status_enum AS ENUM ('none', 'trial', 'active', 'paused', 'cancelled', 'expired');
   CREATE TYPE view_preference_enum AS ENUM ('week', 'today');
   CREATE TYPE recipe_status_enum AS ENUM ('draft', 'published', 'archived');
   CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
   CREATE TYPE draft_status_enum AS ENUM ('draft', 'validating', 'approved', 'published');
   CREATE TYPE validation_type_enum AS ENUM ('ai_nutrition', 'ai_variety', 'manual_review');
   CREATE TYPE validation_status_enum AS ENUM ('pass', 'fail', 'warning');
   CREATE TYPE import_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');

   -- Users Table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email VARCHAR UNIQUE NOT NULL,
     hashed_password VARCHAR NOT NULL,
     household_size INTEGER CHECK (household_size >= 1 AND household_size <= 6),
     menu_type menu_type_enum NOT NULL,
     subscription_status subscription_status_enum DEFAULT 'none',
     has_active_trial BOOLEAN DEFAULT false,
     has_trial_gift_access BOOLEAN DEFAULT false,
     default_view_preference view_preference_enum DEFAULT 'week',
     custom_shopping_categories TEXT[] DEFAULT '{}',
     trial_ends_at TIMESTAMPTZ,
     subscription_paused_until TIMESTAMPTZ,
     stripe_customer_id VARCHAR,
     stripe_subscription_id VARCHAR,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Continue with remaining 15 tables...
   -- (Include complete schema from architecture.md)
   ```

3. **Deploy Schema**

   ```bash
   # Push to remote database
   supabase db push

   # Generate TypeScript types
   supabase gen types typescript --local > apps/web/types/database.types.ts
   ```

### 3.3 Configure Row Level Security (RLS)

Create RLS policies migration:

```bash
supabase migration new rls_policies
```

Add RLS policies for secure data access:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
-- Continue for all tables...

-- User access policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
-- Continue with all necessary policies...
```

## Phase 4: Edge Functions Deployment

### 4.1 Prepare Edge Functions

1. **Review Edge Functions Structure**

   ```
   supabase/functions/
   ├── auth/
   ├── meal-plans/
   ├── recipes/
   ├── payments/
   ├── admin/
   └── shared/
   ```

2. **Set Function Environment Variables**
   ```bash
   # Set secrets for edge functions
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   supabase secrets set GEMINI_API_KEY=AIza...
   supabase secrets set RESEND_API_KEY=re_...
   supabase secrets set UPSTASH_REDIS_REST_URL=https://[ID].upstash.io
   supabase secrets set UPSTASH_REDIS_REST_TOKEN=[token]
   ```

### 4.2 Deploy Edge Functions

```bash
# Deploy all edge functions
supabase functions deploy auth
supabase functions deploy meal-plans
supabase functions deploy recipes
supabase functions deploy payments
supabase functions deploy admin
supabase functions deploy stripe-webhook

# Verify deployment
supabase functions list
```

## Phase 5: Vercel Deployment

### 5.1 Connect Repository to Vercel

1. **Import Project**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import from GitHub: your forked repository
   - Framework Preset: Next.js
   - Root Directory: `./` (monorepo root)

2. **Configure Build Settings**
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
   - Development Command: `pnpm dev`

### 5.2 Environment Variables Setup

Add all environment variables from Phase 2.2 in Vercel Dashboard:

- Settings → Environment Variables
- Add each variable for Production and Preview environments
- Ensure sensitive keys are marked as sensitive

### 5.3 Domain Configuration

1. **Add Custom Domain**
   - Settings → Domains
   - Add `coquinate.ro`
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Automatically handled by Vercel
   - Verify HTTPS works after DNS propagation

## Phase 6: Database Seed Data

### 6.1 Create Admin User

```sql
-- Create admin user (run in Supabase SQL editor)
INSERT INTO users (
  id,
  email,
  hashed_password,
  household_size,
  menu_type,
  subscription_status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@coquinate.ro',
  '$2a$10$[bcrypt-hash-of-secure-password]',
  2,
  'omnivore',
  'none'
);
```

### 6.2 Seed Trial Menu Data

```sql
-- Insert sample recipes for trial users
-- (Add 9 sample recipes covering 3 days: breakfast, lunch, dinner)
-- Use culturally relevant Romanian recipes
```

## Phase 7: Testing & Verification

### 7.1 Health Checks

```bash
# Test API endpoints
curl https://[PROJECT_REF].supabase.co/functions/v1/health
curl https://coquinate.ro/api/health

# Test database connection
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### 7.2 Critical Path Testing

**Launch Mode Testing (CRITICAL - Test First):**

1. [ ] Set `NEXT_PUBLIC_LAUNCH_MODE="coming-soon"` 
2. [ ] Visit https://coquinate.ro - should show Coming Soon page
3. [ ] Try /dashboard - should redirect to /
4. [ ] Try /pricing - should redirect to /
5. [ ] Visit /privacy - should be accessible
6. [ ] Visit /terms - should be accessible

**User Registration Flow (After Full Launch):**

1. [ ] Visit https://coquinate.ro
2. [ ] Complete registration form
3. [ ] Verify email verification (if enabled)
4. [ ] Access trial meal plan
5. [ ] Test meal plan interactions

**Payment Flow:**

1. [ ] Start subscription process
2. [ ] Complete Stripe payment
3. [ ] Verify subscription activation
4. [ ] Test access to premium features

**Admin Dashboard:**

1. [ ] Access admin.coquinate.ro (or admin route)
2. [ ] Login with admin credentials
3. [ ] Create sample recipe
4. [ ] Test meal plan builder
5. [ ] Verify publication workflow

### 7.3 Performance Verification

```bash
# Check Core Web Vitals
curl -X POST https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://coquinate.ro

# Monitor function execution times in Supabase Dashboard
# Check Vercel Analytics for performance metrics
```

## Phase 8: Monitoring & Alerting Setup

### 8.1 Vercel Analytics

- Enable Web Analytics in Vercel Dashboard
- Configure custom events for key user actions:
  - Registration completions
  - Trial starts
  - Subscription conversions
  - Weekly plan views

### 8.2 Supabase Monitoring

- Monitor function executions and errors
- Set up log retention policies
- Review database performance metrics

### 8.3 External Service Monitoring

**Stripe Webhooks:**

- Verify webhook endpoint health
- Monitor failed webhook deliveries
- Set up alerting for payment failures

**Email Delivery:**

- Monitor Resend delivery rates
- Set up bounce/spam notifications

## Phase 9: Security Hardening

### 9.1 Database Security

```sql
-- Verify RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Audit user permissions
\du
```

### 9.2 API Security

- [ ] Verify CORS configuration
- [ ] Test rate limiting on Edge Functions
- [ ] Validate JWT token handling
- [ ] Check for exposed sensitive data in API responses

### 9.3 Frontend Security

- [ ] Verify Content Security Policy headers
- [ ] Check for hardcoded secrets in bundle
- [ ] Test authentication state management
- [ ] Validate input sanitization

## Phase 10: Go-Live Checklist

### 10.1 Pre-Launch Verification

- [ ] All environment variables configured correctly
- [ ] **Launch Mode configured (NEXT_PUBLIC_LAUNCH_MODE="coming-soon")**
- [ ] Database schema deployed and verified
- [ ] All Edge Functions deployed and responding
- [ ] Frontend builds and deploys successfully
- [ ] Payment processing works end-to-end
- [ ] Email delivery configured and tested
- [ ] Domain DNS properly configured
- [ ] SSL certificates active
- [ ] Admin dashboard accessible and functional
- [ ] Trial menu data populated
- [ ] Monitoring and alerting configured
- [ ] **Launch Mode routing tested (verify blocked routes redirect correctly)**

### 10.2 Launch Sequence

1. **Configure Launch Mode**

   ```bash
   # Start with Coming Soon mode
   # In Vercel Dashboard → Environment Variables:
   NEXT_PUBLIC_LAUNCH_MODE="coming-soon"
   
   # Deploy and verify only landing page is accessible
   ```

2. **Final DNS Update**

   ```bash
   # Update A/CNAME records to point to Vercel
   # Wait for DNS propagation (up to 48 hours)
   ```

3. **Progressive Launch Phases**

   **Phase 1 - Coming Soon (Week 1-2):**
   ```bash
   # Verify launch mode is set to 'coming-soon'
   # Only accessible: /, /privacy, /terms
   # Collect early bird emails
   ```

   **Phase 2 - Soft Launch (Week 3-4):**
   ```bash
   # Update in Vercel Environment Variables:
   NEXT_PUBLIC_LAUNCH_MODE="full-launch"
   
   # Marketing pages become accessible
   # App features remain blocked
   # Run beta testing with select users
   ```

   **Phase 3 - Full Launch (Week 5+):**
   ```bash
   # Update in Vercel Environment Variables:
   NEXT_PUBLIC_LAUNCH_MODE="full-launch"
   
   # All features accessible
   # Remove "beta" messaging
   # Enable search engine indexing
   ```

4. **Cache Warming**

   ```bash
   # Pre-warm key pages based on launch mode
   curl https://coquinate.ro
   curl https://coquinate.ro/register  # (when in full-launch)
   curl https://coquinate.ro/pricing   # (when in full-launch)
   ```

5. **Announcement**
   - Update social media profiles
   - Send announcement to early bird email list
   - Submit to Romanian startup directories (after full launch)

## Phase 11: Post-Launch Maintenance

### 11.1 Daily Monitoring

- [ ] Check Vercel deployment status
- [ ] Review Supabase function execution logs
- [ ] Monitor Stripe webhook deliveries
- [ ] Verify email delivery rates
- [ ] Check error rates and performance metrics

### 11.2 Weekly Maintenance

- [ ] Review user registration trends
- [ ] Check trial-to-paid conversion rates
- [ ] Audit failed payments and follow up
- [ ] Update meal plans (admin task)
- [ ] Review security alerts and updates

### 11.3 Backup Strategy

- **Database**: Automatic Supabase backups (daily)
- **Code**: Git repository with tagged releases
- **Environment Variables**: Secure offline backup
- **Stripe Data**: Regular webhook data validation

## Troubleshooting Guide

### Common Deployment Issues

**Build Failures:**

```bash
# Check Node.js version
node --version  # Should be 20.x or 22.x

# Clear pnpm cache
pnpm store prune

# Verify all dependencies install
pnpm install --frozen-lockfile
```

**Database Connection Issues:**

```bash
# Test connection
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Check firewall settings
# Verify RLS policies aren't blocking access
```

**Edge Function Errors:**

```bash
# Check function logs
supabase functions logs [function-name]

# Verify environment secrets
supabase secrets list
```

**Payment Integration Issues:**

- Verify webhook endpoint URL in Stripe dashboard
- Check webhook secret matches environment variable
- Review Stripe logs for failed webhook deliveries
- Ensure test/live keys match environment

### Performance Issues

**Slow Page Loads:**

- Check Vercel function execution times
- Review database query performance in Supabase
- Analyze bundle size with `pnpm run analyze`
- Verify CDN cache headers

**Database Performance:**

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Security Incidents

**Suspected Data Breach:**

1. Immediately rotate all API keys and secrets
2. Review Supabase audit logs
3. Check Vercel access logs
4. Notify users if personal data potentially compromised
5. Contact Supabase support for forensic analysis

**Failed Authentication:**

- Check JWT secret configuration
- Verify RLS policies
- Review auth function logs
- Test with different user accounts

## Emergency Procedures

### Rollback Process

**Frontend Rollback:**

1. Access Vercel Dashboard
2. Navigate to Deployments
3. Click "Promote to Production" on previous working deployment
4. Monitor for successful rollback

**Database Rollback:**

```bash
# Only if schema changes caused issues
supabase db reset --linked
supabase db push [previous-migration]
```

**Edge Function Rollback:**

```bash
# Redeploy previous version
git checkout [previous-commit]
supabase functions deploy [function-name]
```

### Contact Information

**Emergency Contacts:**

- Supabase Support: https://supabase.com/dashboard/support
- Vercel Support: https://vercel.com/help
- Stripe Support: https://support.stripe.com/

**Service Status Pages:**

- Supabase: https://status.supabase.com
- Vercel: https://vercel.com/status
- Stripe: https://status.stripe.com

## Appendix A: Service Configuration Checklists

### A.1 Supabase Setup Checklist

- [ ] Project created in EU-Central region
- [ ] Database password recorded securely
- [ ] API keys copied and secured
- [ ] Access token generated
- [ ] Schema deployed successfully
- [ ] RLS policies configured
- [ ] Edge functions deployed
- [ ] Environment secrets set
- [ ] Test admin user created

### A.2 Vercel Setup Checklist

- [ ] Repository connected
- [ ] Build configuration correct
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Preview deployments working

### A.3 External Services Checklist

- [ ] Stripe account verified
- [ ] Payment products created
- [ ] Webhooks configured
- [ ] Resend domain verified
- [ ] Email templates ready
- [ ] Upstash Redis accessible
- [ ] Gemini AI API key working

---

**Document Version:** 1.0  
**Last Updated:** January 11, 2025  
**Next Review Date:** March 11, 2025

This deployment runbook should be updated after each major deployment to reflect any changes in the process or new requirements discovered during deployment.
