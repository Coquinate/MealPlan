# Information Architecture (IA)

## Site Map / Screen Inventory (Refined)

```mermaid
graph TD
    A[coquinate.ro] --> B[Public Pages]
    A --> C[User App]
    A --> D[admin.coquinate.ro]

    B --> B1[Homepage /]
    B --> B2[Pricing /pricing]
    B --> B3[Sample Menu /menu-example]
    B --> B4[Blog /blog]
    B --> B5[Auth /login, /signup, /reset]

    C --> C1[/app/today]
    C --> C2[/app/week]
    C --> C3[/app/shopping]
    C --> C4[/app/account]

    C4 --> E[Profile & Preferences]
    C4 --> F[Household Settings]
    C4 --> G[Billing & Subscription]
    C4 --> H[Meal History - Last 4 Weeks]
    C4 --> I[My Trial Recipes]
    C4 --> J[This Week Settings]

    J --> J1[Guest Mode Toggle]
    J --> J2[Vacation Mode]

    D --> D1[2FA Admin Login]
    D1 -->|Success| D2[Admin Dashboard]
    D1 -->|Fail| D3[Generic Error]
    D2 --> D4[Menu Type Selector]
    D4 --> D5[Recipes]
    D4 --> D6[Meal Plans]
    D4 --> D7[Validation]
    D4 --> D8[Analytics]

    style D fill:#ffe4b5
    style D1 fill:#ffe4b5
    style D2 fill:#ffe4b5
```

## Navigation Structure (Refined)

**Primary Navigation (User Mobile):**

- Bottom tab bar (44px minimum touch targets):
  - **Today** (default view or user preference per FR32)
  - **Week** (7-day meal grid)
  - **Shopping** (interactive list with check-off)
  - **Account** (user icon - clearer than "Settings")

**Primary Navigation (User Desktop):**

- Left sidebar with same items
- Additional quick actions: Export PDF, Print Week
- Persistent header with logout

**Secondary Navigation (Within Account):**

- **Profile & Preferences** - Name, email, default view (Week/Today)
- **Household Settings** - Size (1-6), menu type (Omnivore/Vegetarian)
- **This Week** - Guest mode toggle, vacation mode
- **Subscription** - Plan type, payment method, invoices, upgrade/downgrade
- **Recent History** - Last 4 weeks meal names (read-only)
- **My Trial Recipes** - Forever-accessible trial menu
- **Help & Support** - FAQ, contact
- **Logout**

**Admin Navigation (Separate System):**

- Subdomain: `admin.coquinate.ro` (completely isolated)
- Security: Strong password + 2FA required (no IP whitelist - dynamic IPs in RO)
- Tab-based structure: Recipes | Meal Plans | Validation | Analytics | Settings
- Menu type indicator: Large "OMNIVORE" or "VEGETARIAN" badge in header
- Status bar: Current week, validation status, publish deadline (Wednesday 2 PM)
- Quick actions: Clone Last Week, Emergency Override, Force Publish
- Failed login shows generic error (not revealing admin exists)

**Breadcrumb Strategy:**

- Desktop only: Show for pages 2+ levels deep
- Mobile: Back arrow with parent page name
- Format: Week View > Thursday > Dinner
- Not needed for primary navigation items

## Information Hierarchy

**User App - Intentionally Flat:**

1. **Level 0:** App root (determines default view based on user state)
2. **Level 1:** Primary views (Today, Week, Shopping, Account)
3. **Level 2:** Details/Actions (Meal details, Account subsections, PDF export)

**URL Structure (Clean & Consistent):**

- `/app/today` - Today's meals view
- `/app/week` - Weekly grid view (with "Recent History" link)
- `/app/shopping` - Shopping list (with guest mode reminder)
- `/app/account` - All user settings
- `/app/account/subscription` - Plan management and billing
- `/app/account/history` - Recent 4 weeks meal names
- `/app/account/trial` - Forever-accessible trial recipes

**Key Design Decisions:**

- NO recipe browsing/library (users get assigned meals only)
- NO meal history beyond current week + 3 days previous (per FR10)
- NO alternative meals or swapping (philosophy: take it or leave it)
- Trial menu remains visible forever but read-only (gift)
- Separate admin login prevents user confusion and improves security - supports multiple admin accounts with identical permissions

**State-Based Access:**

- **Trial (Days 1-3):** Full access to 3-day curated menu
- **Expired Trial:** Read-only access to trial menu + upgrade prompts
- **Paid:** Current week + 3 days of previous week
- **Paused:** Read-only access to previously received plans

## Critical IA Decisions (Preventing Future Regrets)

**1. Admin Complete Isolation:**

- Admin on separate subdomain: `admin.coquinate.ro`
- Different deployment/repository if possible
- No shared navigation or components with user app
- Users should never know admin exists

**2. Meal History (Limited Archive):**

- Show last 4 weeks of meal names only (read-only)
- Located in Account > Meal History
- No recipes or details accessible (just names)
- Creates desire for full feature in future
- Tracks clicks to measure demand

**3. Guest Handling (Manual for MVP):**

- Located in Account > This Week settings
- Simple toggle: "I have guests this week"
- Shows reminder on shopping list: "Remember to adjust quantities for guests"
- No automatic scaling - users handle mentally
- Prevents complexity while acknowledging the need

**4. Trial Differentiation:**

- Trial shows 3 meals/day (not all 4)
- Fourth meal slot shows "🔒 Unlock all meals"
- Makes it clear trial is a sample, not full experience
- Prevents trial-hopping abuse
