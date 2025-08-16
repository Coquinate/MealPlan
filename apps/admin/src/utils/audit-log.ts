/**
 * Audit logging utility for tracking admin actions
 */
import { supabase } from '@/lib/supabase';
import { fetchWithCSRF } from './csrf';
import { AuditLogEntry, ApiResponse } from '@/types/api';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | '2FA_ENABLE'
  | '2FA_DISABLE'
  | '2FA_VERIFY'
  | 'RECIPE_CREATE'
  | 'RECIPE_UPDATE'
  | 'RECIPE_DELETE'
  | 'RECIPE_PUBLISH'
  | 'RECIPE_UNPUBLISH'
  | 'MEAL_PLAN_CREATE'
  | 'MEAL_PLAN_UPDATE'
  | 'MEAL_PLAN_DELETE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'SETTINGS_UPDATE'
  | 'PERMISSION_GRANT'
  | 'PERMISSION_REVOKE'
  | 'ERROR_RESOLVE'
  | 'ERROR_DISMISS'
  | 'DATA_EXPORT'
  | 'DATA_IMPORT'
  | 'SYSTEM_CONFIG_UPDATE';

export interface AuditContext {
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  result: 'success' | 'failure';
  errorMessage?: string;
}

class AuditLogger {
  private queue: AuditLogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly MAX_QUEUE_SIZE = 10;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  /**
   * Log an admin action to the audit trail
   */
  async log(context: AuditContext): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('Cannot log audit event - no authenticated user');
        return;
      }

      const entry: AuditLogEntry = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId: user.id,
        userEmail: user.email || '',
        action: context.action,
        resource: context.resource,
        resourceId: context.resourceId,
        details: context.details,
        ipAddress: await this.getClientIp(),
        userAgent: navigator.userAgent,
        result: context.result,
        errorMessage: context.errorMessage,
      };

      // Add to queue
      this.queue.push(entry);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `📋 [AUDIT] ${context.action} on ${context.resource}`,
          context.resourceId ? `(${context.resourceId})` : '',
          `- ${context.result}`,
          context.errorMessage ? `- Error: ${context.errorMessage}` : ''
        );
      }

      // Flush if queue is full or start timer
      if (this.queue.length >= this.MAX_QUEUE_SIZE) {
        await this.flush();
      } else if (!this.flushTimer) {
        this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging should not break the app
    }
  }

  /**
   * Flush the audit log queue to the server
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    const entriesToFlush = [...this.queue];
    this.queue = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Store locally if not authenticated
        this.storeLocally(entriesToFlush);
        return;
      }

      const response = await fetchWithCSRF('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ entries: entriesToFlush }),
      });

      if (!response.ok) {
        // Store locally if API fails
        this.storeLocally(entriesToFlush);
      }
    } catch (error) {
      console.error('Failed to flush audit log:', error);
      // Store locally if flush fails
      this.storeLocally(entriesToFlush);
    }
  }

  /**
   * Store audit logs locally when server is unavailable
   */
  private storeLocally(entries: AuditLogEntry[]): void {
    try {
      const storedLogs = localStorage.getItem('admin_audit_queue');
      const existingLogs = storedLogs ? JSON.parse(storedLogs) : [];
      const updatedLogs = [...existingLogs, ...entries];

      // Keep only last 100 entries to prevent localStorage overflow
      const trimmedLogs = updatedLogs.slice(-100);

      localStorage.setItem('admin_audit_queue', JSON.stringify(trimmedLogs));
      console.log(`📦 Stored ${entries.length} audit logs locally`);
    } catch (error) {
      console.error('Failed to store audit logs locally:', error);
    }
  }

  /**
   * Retry sending locally stored audit logs
   */
  async retryLocalLogs(): Promise<void> {
    try {
      const storedLogs = localStorage.getItem('admin_audit_queue');
      if (!storedLogs) return;

      const logs = JSON.parse(storedLogs) as AuditLogEntry[];
      if (logs.length === 0) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetchWithCSRF('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ entries: logs }),
      });

      if (response.ok) {
        localStorage.removeItem('admin_audit_queue');
        console.log(`✅ Successfully sent ${logs.length} locally stored audit logs`);
      }
    } catch (error) {
      console.error('Failed to retry local audit logs:', error);
    }
  }

  /**
   * Get client IP address (best effort)
   */
  private async getClientIp(): Promise<string | undefined> {
    try {
      // Try to get IP from a public API (only in production)
      if (process.env.NODE_ENV === 'production') {
        const response = await fetch('https://api.ipify.org?format=json', {
          signal: AbortSignal.timeout(1000), // 1 second timeout
        });
        if (response.ok) {
          const data = await response.json();
          return data.ip;
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Force flush all pending logs
   */
  async forceFlush(): Promise<void> {
    await this.flush();
    await this.retryLocalLogs();
  }
}

// Singleton instance
export const auditLogger = new AuditLogger();

// Convenience functions for common actions
export const auditLog = {
  login: (userId: string, success: boolean, details?: Record<string, any>) =>
    auditLogger.log({
      action: 'LOGIN',
      resource: 'auth',
      resourceId: userId,
      details,
      result: success ? 'success' : 'failure',
      errorMessage: success ? undefined : 'Login failed',
    }),

  logout: (userId: string) =>
    auditLogger.log({
      action: 'LOGOUT',
      resource: 'auth',
      resourceId: userId,
      result: 'success',
    }),

  twoFactorEnable: (userId: string, success: boolean) =>
    auditLogger.log({
      action: '2FA_ENABLE',
      resource: 'auth',
      resourceId: userId,
      result: success ? 'success' : 'failure',
    }),

  twoFactorVerify: (userId: string, success: boolean) =>
    auditLogger.log({
      action: '2FA_VERIFY',
      resource: 'auth',
      resourceId: userId,
      result: success ? 'success' : 'failure',
    }),

  recipeCreate: (recipeId: string, title: string) =>
    auditLogger.log({
      action: 'RECIPE_CREATE',
      resource: 'recipe',
      resourceId: recipeId,
      details: { title },
      result: 'success',
    }),

  recipeUpdate: (recipeId: string, changes: Record<string, any>) =>
    auditLogger.log({
      action: 'RECIPE_UPDATE',
      resource: 'recipe',
      resourceId: recipeId,
      details: { changes },
      result: 'success',
    }),

  recipeDelete: (recipeId: string, title?: string) =>
    auditLogger.log({
      action: 'RECIPE_DELETE',
      resource: 'recipe',
      resourceId: recipeId,
      details: { title },
      result: 'success',
    }),

  errorResolve: (errorId: string, resolved: boolean) =>
    auditLogger.log({
      action: 'ERROR_RESOLVE',
      resource: 'error',
      resourceId: errorId,
      details: { resolved },
      result: 'success',
    }),

  settingsUpdate: (setting: string, oldValue: any, newValue: any) =>
    auditLogger.log({
      action: 'SETTINGS_UPDATE',
      resource: 'settings',
      resourceId: setting,
      details: { oldValue, newValue },
      result: 'success',
    }),

  dataExport: (type: string, recordCount: number) =>
    auditLogger.log({
      action: 'DATA_EXPORT',
      resource: 'data',
      details: { type, recordCount },
      result: 'success',
    }),

  custom: (context: AuditContext) => auditLogger.log(context),
};

// Flush logs on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    auditLogger.forceFlush();
  });

  // Retry local logs on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      auditLogger.retryLocalLogs();
    }, 5000); // Wait 5 seconds after load
  });
}
