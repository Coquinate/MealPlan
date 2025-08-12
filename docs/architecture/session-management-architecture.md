# Session Management Architecture

## Single Session Enforcement

Coquinate enforces single active sessions per user to prevent data conflicts and ensure consistent meal planning experience.

### Implementation Strategy

```typescript
interface UserSession {
  userId: string;
  sessionId: string;
  deviceInfo: string;
  lastActivity: Date;
  isActive: boolean;
}

// Session management in Edge Functions
export const sessionRouter = router({
  createSession: protectedProcedure.mutation(async ({ ctx }) => {
    // Invalidate existing sessions
    await invalidateExistingSessions(ctx.user.id);

    // Create new session
    const session = await createNewSession({
      userId: ctx.user.id,
      deviceInfo: ctx.headers['user-agent'],
      sessionId: generateSessionId(),
    });

    return session;
  }),

  validateSession: protectedProcedure.query(async ({ ctx }) => {
    return await validateActiveSession(ctx.user.id, ctx.sessionId);
  }),
});
```

### Database Schema

```sql
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  device_info TEXT,
  ip_address INET,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT one_active_session_per_user
    EXCLUDE (user_id WITH =) WHERE (is_active = true)
);
```

## No Real-Time Collaboration

- **Design Decision**: Single-user meal planning sessions only
- **Rationale**: Prevents complexity of conflict resolution, maintains data consistency
- **Implementation**: Session-based locking, no WebSocket requirements for collaboration
