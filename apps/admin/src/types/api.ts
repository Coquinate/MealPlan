/**
 * Type definitions for all API responses in the admin dashboard
 */

// Base response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Error response types
export interface ErrorResponse {
  error: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  validationErrors: {
    field: string;
    message: string;
    code?: string;
  }[];
}

// Admin auth response types
export interface AdminAuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: 'super_admin' | 'admin' | 'operator';
    permissions: Record<string, boolean>;
  };
  token?: string;
  expiresAt?: string;
  requires2FA?: boolean;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  verified: boolean;
  message?: string;
  error?: string;
}

export interface TwoFactorEnableResponse {
  success: boolean;
  qrCodeUrl?: string;
  secret?: string;
  backupCodes?: string[];
  error?: string;
}

// Error monitoring response types
export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'frontend' | 'backend' | 'payment' | 'auth' | 'database';
  errorMessage: string;
  userId?: string;
  route?: string;
  resolved: boolean;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface ErrorStatsResponse {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unresolved: number;
  last24h: number;
  byCategory: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ErrorDashboardResponse extends ApiResponse {
  errors: ErrorLogEntry[];
  stats: ErrorStatsResponse;
}

// Recipe management response types
export interface RecipeResponse {
  id: string;
  title: string;
  description?: string;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUrl?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface RecipeUploadResponse extends ApiResponse {
  recipe?: RecipeResponse;
  imageUrl?: string;
  validationErrors?: ValidationErrorResponse['validationErrors'];
}

// Analytics response types
export interface AnalyticsOverviewResponse extends ApiResponse {
  data?: {
    totalUsers: number;
    activeUsers: number;
    totalRecipes: number;
    totalMealPlans: number;
    subscriptions: {
      active: number;
      cancelled: number;
      trial: number;
    };
    revenue: {
      current: number;
      previous: number;
      growth: number;
    };
  };
}

export interface UserActivityResponse extends ApiResponse {
  data?: {
    dailyActiveUsers: Array<{
      date: string;
      count: number;
    }>;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    retentionRate: number;
  };
}

// Audit log response types
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  result: 'success' | 'failure';
  errorMessage?: string;
}

export interface AuditLogResponse extends ApiResponse {
  logs: AuditLogEntry[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

// Permission check response types
export interface PermissionCheckResponse extends ApiResponse {
  hasPermission: boolean;
  requiredPermissions?: string[];
  userPermissions?: string[];
  reason?: string;
}

// Type guards for runtime type checking
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' && obj !== null && 'success' in obj && typeof obj.success === 'boolean'
  );
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'error' in obj &&
    'statusCode' in obj &&
    typeof obj.error === 'string' &&
    typeof obj.statusCode === 'number'
  );
}

export function isPaginatedResponse<T>(obj: any): obj is PaginatedResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.items) &&
    typeof obj.total === 'number' &&
    typeof obj.page === 'number' &&
    typeof obj.pageSize === 'number' &&
    typeof obj.hasMore === 'boolean'
  );
}

// Response transformer utilities
export function transformApiResponse<T>(response: any): ApiResponse<T> {
  if (isApiResponse<T>(response)) {
    return response;
  }

  // Try to transform unknown response format
  return {
    success: response.ok || response.success || false,
    data: response.data || response.result || response,
    error: response.error || response.message,
    statusCode: response.statusCode || response.status,
    timestamp: response.timestamp || new Date().toISOString(),
  };
}

// Safe data extraction with type checking
export function extractData<T>(response: ApiResponse<T>, defaultValue: T): T {
  if (response.success && response.data !== undefined) {
    return response.data;
  }
  return defaultValue;
}

// Response validation
export function validateResponse<T>(
  response: any,
  validator: (data: any) => data is T
): ApiResponse<T> {
  const transformed = transformApiResponse<T>(response);

  if (transformed.success && transformed.data) {
    if (!validator(transformed.data)) {
      return {
        success: false,
        error: 'Response validation failed',
        statusCode: 500,
      };
    }
  }

  return transformed;
}
