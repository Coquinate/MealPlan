/**
 * Permission checking utility for admin operations
 */
import { supabase } from '@/lib/supabase';
import { fetchWithCSRF } from './csrf';
import { PermissionCheckResponse } from '@/types/api';
import { auditLog, AuditAction } from './audit-log';

export type Permission =
  | 'recipes.create'
  | 'recipes.update'
  | 'recipes.delete'
  | 'recipes.publish'
  | 'meal_plans.create'
  | 'meal_plans.update'
  | 'meal_plans.delete'
  | 'users.view'
  | 'users.update'
  | 'users.delete'
  | 'settings.view'
  | 'settings.update'
  | 'analytics.view'
  | 'analytics.export'
  | 'errors.view'
  | 'errors.resolve'
  | 'admin.manage'
  | 'admin.grant_permissions'
  | 'system.config'
  | 'system.export'
  | 'system.import';

export type Role = 'super_admin' | 'admin' | 'operator';

// Default permissions by role
const DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    // Super admin has all permissions
    'recipes.create',
    'recipes.update',
    'recipes.delete',
    'recipes.publish',
    'meal_plans.create',
    'meal_plans.update',
    'meal_plans.delete',
    'users.view',
    'users.update',
    'users.delete',
    'settings.view',
    'settings.update',
    'analytics.view',
    'analytics.export',
    'errors.view',
    'errors.resolve',
    'admin.manage',
    'admin.grant_permissions',
    'system.config',
    'system.export',
    'system.import',
  ],
  admin: [
    // Admin has most permissions except system and admin management
    'recipes.create',
    'recipes.update',
    'recipes.delete',
    'recipes.publish',
    'meal_plans.create',
    'meal_plans.update',
    'meal_plans.delete',
    'users.view',
    'users.update',
    'settings.view',
    'settings.update',
    'analytics.view',
    'analytics.export',
    'errors.view',
    'errors.resolve',
  ],
  operator: [
    // Operator has limited permissions
    'recipes.create',
    'recipes.update',
    'meal_plans.create',
    'meal_plans.update',
    'users.view',
    'settings.view',
    'analytics.view',
    'errors.view',
  ],
};

class PermissionManager {
  private cache: Map<string, { permissions: Permission[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if current user has a specific permission
   */
  async hasPermission(permission: Permission): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions();
      return permissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if current user has all specified permissions
   */
  async hasPermissions(permissions: Permission[]): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions();
      return permissions.every((p) => userPermissions.includes(p));
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Check if current user has any of the specified permissions
   */
  async hasAnyPermission(permissions: Permission[]): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions();
      return permissions.some((p) => userPermissions.includes(p));
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Get all permissions for the current user
   */
  async getUserPermissions(): Promise<Permission[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      // Check cache
      const cached = this.cache.get(user.id);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.permissions;
      }

      // Fetch from database
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('role, permissions')
        .eq('user_id', user.id)
        .single();

      if (error || !adminUser) {
        return [];
      }

      // Combine role-based and custom permissions
      const rolePermissions = DEFAULT_PERMISSIONS[adminUser.role as Role] || [];
      const customPermissions = adminUser.permissions?.custom || [];
      const revokedPermissions = adminUser.permissions?.revoked || [];

      // Merge permissions
      const allPermissions = [...new Set([...rolePermissions, ...customPermissions])];
      const finalPermissions = allPermissions.filter((p) => !revokedPermissions.includes(p));

      // Cache the result
      this.cache.set(user.id, {
        permissions: finalPermissions,
        timestamp: Date.now(),
      });

      return finalPermissions;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  /**
   * Require permission for an operation (throws if not allowed)
   */
  async requirePermission(permission: Permission, resource?: string): Promise<void> {
    const hasPermission = await this.hasPermission(permission);

    if (!hasPermission) {
      // Log permission denial
      await auditLog.custom({
        action: 'PERMISSION_DENIED' as AuditAction,
        resource: resource || permission,
        result: 'failure',
        errorMessage: `Permission denied: ${permission}`,
      });

      throw new PermissionError(
        `Permission denied: ${permission}`,
        permission,
        await this.getUserPermissions()
      );
    }
  }

  /**
   * Require any of the specified permissions (throws if none allowed)
   */
  async requireAnyPermission(permissions: Permission[], resource?: string): Promise<void> {
    const hasPermission = await this.hasAnyPermission(permissions);

    if (!hasPermission) {
      // Log permission denial
      await auditLog.custom({
        action: 'PERMISSION_DENIED' as AuditAction,
        resource: resource || permissions.join(', '),
        result: 'failure',
        errorMessage: `Permission denied: requires one of ${permissions.join(', ')}`,
      });

      throw new PermissionError(
        `Permission denied: requires one of ${permissions.join(', ')}`,
        permissions[0],
        await this.getUserPermissions()
      );
    }
  }

  /**
   * Clear permission cache for a user
   */
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Check permission via API (for server-side validation)
   */
  async checkPermissionApi(permission: Permission): Promise<PermissionCheckResponse> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return {
          success: false,
          hasPermission: false,
          reason: 'Not authenticated',
        };
      }

      const response = await fetchWithCSRF('/api/admin/check-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ permission }),
      });

      if (response.ok) {
        return await response.json();
      }

      return {
        success: false,
        hasPermission: false,
        reason: 'Failed to check permission',
      };
    } catch (error) {
      console.error('Error checking permission via API:', error);
      return {
        success: false,
        hasPermission: false,
        reason: 'Error checking permission',
      };
    }
  }
}

/**
 * Custom error class for permission errors
 */
export class PermissionError extends Error {
  constructor(
    message: string,
    public requiredPermission: Permission | Permission[],
    public userPermissions: Permission[]
  ) {
    super(message);
    this.name = 'PermissionError';
  }
}

// Singleton instance
export const permissions = new PermissionManager();

// React hook for permission checking
import { useEffect, useState } from 'react';

export function usePermission(permission: Permission | Permission[]): {
  hasPermission: boolean;
  loading: boolean;
  error: Error | null;
} {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        setError(null);

        let allowed = false;
        if (Array.isArray(permission)) {
          allowed = await permissions.hasAnyPermission(permission);
        } else {
          allowed = await permissions.hasPermission(permission);
        }

        setHasPermission(allowed);
      } catch (err) {
        setError(err as Error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [permission]);

  return { hasPermission, loading, error };
}

// Permission guard component
interface PermissionGuardProps {
  permission: Permission | Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { hasPermission, loading } = usePermission(permission);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Utility function to check permissions before operations
export async function withPermission<T>(
  permission: Permission,
  operation: () => Promise<T>,
  resource?: string
): Promise<T> {
  await permissions.requirePermission(permission, resource);
  return operation();
}
