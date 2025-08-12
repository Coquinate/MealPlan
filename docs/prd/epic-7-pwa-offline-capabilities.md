# Epic 7: PWA & Offline Capabilities

**Epic Goal:** Add Progressive Web App capabilities to enable offline access to meal plans and shopping lists, improving mobile user experience without requiring app store distribution.

## Story 7.1: Basic PWA Setup

**As a** mobile user,  
**I want** to install Coquinate on my home screen,  
**so that** it works like an app.

**Acceptance Criteria:**

1. Web app manifest with name, icons (72px to 512px), theme colors
2. Standalone display mode for app-like experience
3. Service worker registration on first visit
4. Basic offline page for connection loss
5. Install prompt after 3+ meals viewed

## Story 7.2: Offline Meal Plan Access

**As a** user,  
**I want** to view my meals offline,  
**so that** I can cook without internet.

**Acceptance Criteria:**

1. Current week's meal plan cached automatically
2. Recipe details with instructions available offline
3. Shopping list accessible offline (per NFR3)
4. Images cached with placeholder fallbacks
5. Clear offline indicator when no connection

## Story 7.3: Background Sync

**As a** user,  
**I want** my offline actions to sync,  
**so that** nothing is lost when offline.

**Acceptance Criteria:**

1. Queue mark cooked and feedback actions while offline
2. Automatic sync when connection returns
3. Visual sync status indicator
4. Retry failed syncs with exponential backoff

## Story 7.4: Push Notifications (Optional)

**As a** user,  
**I want** optional push notifications,  
**so that** I'm reminded about meal plans.

**Acceptance Criteria:**

1. Opt-in prompt after user engagement
2. Plan ready notification (Thursday 6 AM)
3. Shopping reminder (Friday 5 PM)
4. Settings to enable/disable notifications
5. Works only for users who installed PWA

## Error Handling Strategy

**Error Boundaries:**

- Hierarchical structure: app > page > component levels
- Different fallbacks for different error severities
- Automatic error reporting to monitoring service
- Development vs production error displays

**Error Types:**

- APIError base class with operational flag
- Business errors: Subscription, MealPlan, Trial, Content, Admin
- Integration errors: Stripe, SendGrid, Supabase failures
- Validation errors: Field-level and schema validation
- State errors: Hydration, Store, Cache issues
- Async errors: Timeout, Retry exhausted, Background jobs
- Media errors: Upload, Image processing, PDF generation

**Error Recovery:**

- Automatic recovery strategies for known errors
- Network errors: Wait for connection, retry queue
- Payment errors: Show update modal
- Content errors: Fallback to cached/previous data
- PDF errors: Client-side generation fallback
- Quota errors: Exponential backoff

**User-Facing States:**

- Contextual error messages in Romanian
- Clear retry actions when applicable
- Different icons/styling per error type
- Graceful degradation for non-critical features

**Critical Path Protection:**

- Payment flow wrapped in error boundary
- Admin dashboard protected separately
- Registration process with fallback
- Meal plan viewing with cache fallback

**Error Monitoring:**

- Error queuing and batching
- Critical errors sent immediately
- Context enrichment (user, session, route)
- Admin-specific error alerting

## PWA Implementation

**Web App Manifest:**

- App name, icons (72px to 512px), theme colors
- Standalone display mode for app-like experience
- Shortcuts to Today's meals and Shopping list
- Start URL tracks PWA vs web usage

**Service Worker Strategy:**

- Cache-first for assets (images, fonts, CSS)
- Network-first for API calls with cache fallback
- Offline page for connection loss
- Background sync for offline actions (mark cooked, feedback)

**Offline Capabilities:**

- View cached meal plans and shopping lists
- Mark meals as cooked (syncs when online)
- Give feedback (syncs when online)
- Cannot: make payments, update profile, generate PDFs

**Install Prompt:**

- Custom install prompt after 3+ meals viewed
- Platform detection (iOS shows manual instructions)
- Dismissible with 7-day re-prompt
- Track installation metrics

**Push Notifications (Web):**

- Meal plan ready (Thursday 6 AM)
- Shopping reminder (Friday 5 PM)
- Trial ending reminder
- Cooking time notifications

**Native App Wrapper Decision:**

- NOT implementing for MVP - PWA only
- Eliminates app store fees and approval delays
- Single codebase to maintain
- Can add native wrapper in Phase 2 if needed
- PWA provides 90% of native functionality
