# User Flows

## Critical User Flows

### Flow 1: Trial to Paid Conversion

**User Goal:** Experience value and decide to subscribe
**Entry Points:** Homepage CTA, Marketing pages, Word of mouth
**Success Criteria:** User completes payment and accesses current week

**Flow Diagram:**

```mermaid
graph TD
    A[Homepage] --> B[Start Free Trial]
    B --> C{Auth Method}
    C -->|Google| D[Google OAuth]
    C -->|Email| E[Email + Password]
    D --> F[Household Setup]
    E --> F
    F --> G[Size: 1-6 People]
    G --> H[Type: Omnivore/Veg]
    H --> I[Trial Menu Shown]
    I --> J[3 Days Usage]
    J --> K{Day 3 Notification}
    K -->|Subscribe| L[Payment Flow]
    K -->|Wait| M[Trial Expires]
    L --> N{Bank Approval}
    N -->|App Switch| O[Waiting Screen]
    O --> P[Return to App]
    P --> Q[Payment Success]
    Q --> R[Current Week Access]
    M --> S[Read-Only Trial]
    S --> T{Day 30}
    T --> U[Account Archived]
```

**Edge Cases:**

- Payment fails → Show retry with different method
- Bank app doesn't return → Check webhook, email confirmation
- Multiple trial attempts → Block by email AND device fingerprint
- Zombie accounts → Auto-archive after 30 days inactive

**Critical Implementation Notes:**

- Single session only - new login kicks out other devices
- Payment success page must work even with lost session
- Static backup week ready if Thursday publishing fails

### Flow 2: Weekly Meal Planning Routine

**User Goal:** Get plan, shop efficiently, cook, track progress
**Entry Points:** Thursday notification, Direct app access
**Success Criteria:** Shopping done, meals cooked, feedback given

**Flow Diagram:**

```mermaid
graph TD
    A[Thursday 6 AM] --> B{Plan Ready?}
    B -->|Yes| C[Push Notification]
    B -->|No| D[Fallback Static Week]
    C --> E[Open App]
    D --> E
    E --> F[View Week/Today]
    F --> G[Review Meals]
    G --> H[Open Shopping List]
    H --> I{Shopping Method}
    I -->|In Store| J[Check Items Offline]
    I -->|Online| K[Export PDF]
    I -->|Email| L[Send to Self]
    J --> M[Complete Shopping]
    K --> M
    L --> M
    M --> N[Cook & Track]
    N --> O[Mark Cooked]
    O --> P[Optional Feedback]
```

**Edge Cases:**

- Plan publishing fails → Serve last week's plan with "Updated plan coming" notice
- Offline in store → PWA works with cached data
- PDF fails → "Email yourself" fallback
- Forgot to mark cooked → No penalties, just lose tracking

**Session Management:**

- One active session per account
- "Logged in elsewhere" message if kicked out
- Remember week view preference

### Flow 3: Free Trial Experience

**User Goal:** Experience value quickly, convert to paid
**Entry Points:** Landing page, Social media ads
**Success Criteria:** Convert within 3 days or understand value

**Flow Diagram:**

```mermaid
graph TD
    A[Land on Homepage] --> B[Click Start Trial]
    B --> C[Email + Password Only]
    C --> D[Auto-Login]
    D --> E[See 3-Day Menu]
    E --> F{Day 1-3}
    F -->|Cook| G[Experience Value]
    F -->|Skip| H[See Tomorrow]
    G --> I{Decision Point}
    H --> I
    I -->|Subscribe| J[Payment Flow]
    I -->|Wait| K[Day 4 Locked]
    K --> L[Upgrade Prompt]
    L -->|Subscribe| J
    L -->|Leave| M[Keep Trial Access]
```

**Key Design Decisions:**

- No onboarding survey (immediate value)
- 3 curated days shown immediately
- Trial menu remains forever accessible (gift)
- Day 4 shows locked state clearly

### Flow 4: Subscription & Payment

**User Goal:** Start paid subscription
**Entry Points:** Trial day 4, Upgrade buttons
**Success Criteria:** Active subscription

**Flow Diagram:**

```mermaid
graph TD
    A[Upgrade Prompt] --> B{Plan Choice}
    B -->|Monthly| C[50 RON/month]
    B -->|Annual| D[550 RON/year]
    C --> E[Stripe Checkout]
    D --> E
    E --> F{Payment}
    F -->|Success| G[Instant Access]
    F -->|Fail| H[Error + Retry]
    G --> I[Welcome Email]
    G --> J[Full Week Unlocked]
```

**Payment Handling:**

- Stripe hosted checkout (no PCI compliance needed)
- Support Romanian cards + PayPal
- Clear pricing in RON
- Instant activation

### Flow 5: Admin Meal Planning

**User Goal:** Create weekly meal plan efficiently
**Entry Points:** admin.coquinate.ro
**Success Criteria:** Published plan with no errors

**Flow Diagram:**

```mermaid
graph TD
    A[Admin Login] --> B[Dashboard]
    B --> C[Create Week Plan]
    C --> D[Select 28 Meals]
    D --> E[AI Validation]
    E --> F{Valid?}
    F -->|Yes| G[Preview]
    F -->|No| H[Fix Issues]
    H --> E
    G --> I[Schedule Publish]
    I --> J[Thursday 6 AM]
```

**Admin Safeguards:**

- AI checks for variety/balance
- Leftover flow validation
- Preview before publish
- Rollback capability
