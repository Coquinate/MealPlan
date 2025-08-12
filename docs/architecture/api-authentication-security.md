# API Authentication & Security

```typescript
// JWT token structure
interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  subscriptionStatus: SubscriptionStatus;
  iat: number;
  exp: number;
}

// Admin-specific JWT for enhanced security
interface AdminJWTPayload extends JWTPayload {
  adminId: string;
  permissions: AdminPermission[];
  twoFactorVerified: boolean;
}
```
