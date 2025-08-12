# Push Notification System Architecture

## Web Push Notifications

Coquinate implements web push notifications for meal reminders and shopping list updates, with email fallback for reliability.

### Push Notification Flow

```typescript
interface NotificationPayload {
  type: 'meal_reminder' | 'shopping_reminder' | 'recipe_ready';
  title: string;
  body: string;
  data: {
    mealId?: string;
    shoppingListId?: string;
    recipeId?: string;
    actionUrl: string;
  };
  scheduledFor: Date;
}

// Push notification service
export class PushNotificationService {
  private webPush = require('web-push');

  constructor() {
    this.webPush.setVapidDetails(
      'mailto:notifications@coquinate.ro',
      Deno.env.get('VAPID_PUBLIC_KEY'),
      Deno.env.get('VAPID_PRIVATE_KEY')
    );
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
  ): Promise<void> {
    try {
      await this.webPush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
      // Fallback to email
      await this.sendEmailFallback(payload);
    }
  }
}
```

### Notification Database Schema

```sql
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, endpoint)
);

CREATE TABLE notification_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled notifications using pg_cron
SELECT cron.schedule('process-notifications', '*/5 * * * *',
  'SELECT process_pending_notifications();'
);
```

### Frontend Push Registration

```typescript
// Service worker registration and push setup
class NotificationManager {
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to server
      await trpc.notifications.subscribe.mutate({
        subscription: subscription.toJSON(),
      });

      return subscription;
    }
    return null;
  }
}
```

### Email Fallback System

```typescript
// Email fallback using Resend
interface EmailNotification {
  to: string;
  subject: string;
  template: 'meal_reminder' | 'shopping_reminder' | 'recipe_ready';
  data: Record<string, any>;
}

export const emailFallbackService = {
  async sendFallbackEmail(payload: NotificationPayload, userEmail: string) {
    const emailContent = this.generateEmailContent(payload);

    await resend.emails.send({
      from: 'Coquinate <noreply@coquinate.ro>',
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  },
};
```
