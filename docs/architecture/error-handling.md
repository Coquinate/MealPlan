# Error Handling

## Simple Error Handling Approach

**Frontend:**

- tRPC handles API errors automatically
- Show user-friendly messages in Romanian/English
- Console.error() for debugging in development

**Backend:**

- Zod validation errors return field-specific messages
- Supabase errors are caught and logged
- Generic "Something went wrong" for unexpected errors

## Error Messages

Bilingual error messages provide user-friendly feedback in Romanian and English for common error scenarios including authentication, validation, network, and generic errors.

**Note:** Vercel provides automatic error tracking. No need for complex error handling infrastructure.

## Error Flow Sequence Diagrams

### API Error Handling Flow

This diagram shows how errors propagate through the fullstack system from the backend to the frontend:

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant T as tRPC Client
    participant E as Edge Function
    participant D as Database
    participant L as Logger

    U->>F: Submit form action
    F->>T: tRPC mutation call
    T->>E: HTTP request to API

    alt Validation Error
        E->>E: Zod schema validation
        E-->>T: 400 - Validation error
        T-->>F: TRPCError with field details
        F->>F: Display field-specific errors
        F-->>U: Show Romanian error message
    else Database Error
        E->>D: Query database
        D-->>E: Database connection error
        E->>L: Log error details
        E-->>T: 500 - Internal server error
        T-->>F: TRPCError with generic message
        F->>F: Show fallback error
        F-->>U: "Ceva nu a mers bine. Încearcă din nou."
    else Authentication Error
        E->>E: Verify JWT token
        E-->>T: 401 - Unauthorized
        T-->>F: TRPCError auth failure
        F->>F: Clear user session
        F-->>U: Redirect to login page
    else Network Error
        T->>E: Request times out
        T-->>F: Network error
        F->>F: Retry with exponential backoff
        F-->>U: "Verifică conexiunea la internet"
    else Success Path
        E->>D: Execute query
        D-->>E: Success response
        E-->>T: 200 - Success
        T-->>F: Data response
        F-->>U: Show success state
    end
```

### Payment Error Handling Flow

This diagram shows error handling for the critical payment flow:

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Stripe Element
    participant P as Payment API
    participant W as Webhook Handler
    participant D as Database
    participant E as Email Service

    U->>F: Click "Plătește abonamentul"
    F->>S: Initialize Stripe checkout

    alt Card Declined
        S-->>F: Card declined error
        F->>F: Parse Stripe error code
        F-->>U: "Cardul a fost respins. Verifică datele."
    else Network Error
        S-->>F: Network connection failed
        F->>F: Retry payment initialization
        alt Retry Successful
            F->>S: Retry Stripe checkout
            S-->>U: Show payment form
        else Max Retries Exceeded
            F-->>U: "Eroare de conectare. Încearcă mai târziu."
        end
    else Payment Successful
        S->>P: Process payment
        P->>W: Send webhook

        alt Webhook Processing Error
            W->>D: Update subscription status
            D-->>W: Database error
            W->>W: Log webhook failure
            W->>W: Queue for retry (max 3 attempts)
            Note over W,D: User subscription may be delayed
        else Webhook Success
            W->>D: Update subscription
            W->>E: Send confirmation email
            E-->>U: Email "Abonamentul tău este activ"
            W-->>P: 200 OK
            P-->>S: Payment confirmed
            S-->>F: Success callback
            F-->>U: Show success page
        end
    end
```

### Authentication Error Handling Flow

This diagram shows how authentication errors are handled across the application:

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend App
    participant A as Auth Guard
    participant S as Supabase Auth
    participant R as RLS Policy
    participant D as Database

    U->>F: Access protected route
    F->>A: Check authentication

    alt No JWT Token
        A-->>F: Not authenticated
        F->>F: Store intended route
        F-->>U: Redirect to /login
    else Expired JWT Token
        A->>S: Validate JWT
        S-->>A: Token expired
        A->>S: Attempt refresh
        alt Refresh Successful
            S-->>A: New JWT token
            A->>A: Update local storage
            A-->>F: Authentication successful
            F-->>U: Continue to protected route
        else Refresh Failed
            S-->>A: Refresh token invalid
            A->>A: Clear all tokens
            A-->>F: Authentication failed
            F-->>U: Redirect to /login with message
        end
    else Valid JWT, RLS Denial
        A-->>F: Authentication successful
        F->>D: Fetch user data
        D->>R: Apply RLS policy
        R-->>D: Access denied (wrong user/role)
        D-->>F: 403 Forbidden
        F->>F: Log security event
        F-->>U: "Nu ai acces la această pagină"
    else Successful Authentication
        A-->>F: Authentication successful
        F->>D: Fetch user data
        D->>R: Apply RLS policy
        R-->>D: Access granted
        D-->>F: User data
        F-->>U: Show protected content
    end
```

### Real-time Error Handling Flow

This diagram shows error handling for Supabase Realtime subscriptions:

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant R as Realtime Client
    participant S as Supabase Realtime
    participant D as Database

    F->>R: Subscribe to meal plan updates
    R->>S: Establish WebSocket connection

    alt Connection Success
        S-->>R: Connection established
        R-->>F: Subscription active
        F-->>U: Real-time updates enabled

        loop Real-time Updates
            D->>S: Data change event
            S->>R: Push update
            R->>F: Handle update
            F-->>U: Update UI immediately
        end

    else Connection Failed
        S-->>R: Connection error
        R->>R: Implement exponential backoff
        R->>S: Retry connection (max 5 attempts)
        alt Retry Successful
            S-->>R: Connection established
            R-->>F: Subscription recovered
            F-->>U: Real-time sync restored
        else Max Retries Exceeded
            R-->>F: Connection failed permanently
            F->>F: Fall back to polling mode
            F-->>U: "Actualizări în timp real indisponibile"

            loop Polling Fallback
                F->>D: Manual refresh every 30s
                D-->>F: Latest data
                F-->>U: Update UI (delayed)
            end
        end

    else WebSocket Disconnect
        R->>R: Detect connection loss
        R->>S: Attempt reconnection
        alt Quick Reconnection (<5s)
            S-->>R: Reconnected
            R->>D: Sync missed updates
            D-->>R: Delta updates
            R-->>F: Apply missed changes
            F-->>U: Seamless sync restoration
        else Slow Reconnection (>5s)
            R-->>F: Connection unstable
            F-->>U: "Reconectare în curs..."
            R->>S: Keep trying to reconnect
        end
    end
```
