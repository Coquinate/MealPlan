/**
 * Authentication-related type definitions
 */

import type { User, Session } from '@supabase/supabase-js';

// Re-export Supabase types for convenience
export type { User, Session, AuthError } from '@supabase/supabase-js';

// User profile types
export interface UserProfile {
  id: string;
  email: string;
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  subscription_status: string;
  has_active_trial: boolean;
  has_trial_gift_access: boolean;
  stripe_customer_id?: string;
  trial_ends_at?: string;
  default_view_preference?: 'RO' | 'EN';
  created_at: string;
  updated_at: string;
}

// Authentication credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  default_view_preference?: 'RO' | 'EN';
}

export interface UpdateProfileData {
  household_size?: number;
  menu_type?: 'vegetarian' | 'omnivore';
  default_view_preference?: 'RO' | 'EN';
}

// Authentication state
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Permission types
export interface UserPermissions {
  isAuthenticated: boolean;
  hasProfile: boolean;
  hasActiveSubscription: boolean;
  isTrialUser: boolean;
  isGiftUser: boolean;
  isPaidUser: boolean;
  canAccessPremiumFeatures: boolean;
  userEmail?: string;
  userId?: string;
  menuType?: 'vegetarian' | 'omnivore';
  householdSize?: number;
}

// Subscription types
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired' | 'cancelled';

// Authentication error types
export interface AuthErrorInfo {
  type: 'login' | 'register' | 'profile' | 'session' | 'general';
  message: string;
  timestamp: number;
}

// Route protection types
export interface RouteProtectionConfig {
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireSubscription?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

// Authentication events
export type AuthEventType =
  | 'auth:error'
  | 'auth:force-logout'
  | 'auth:force-signout'
  | 'auth:session-refresh-needed'
  | 'auth:service-issue';

export interface AuthEvent {
  type: AuthEventType;
  detail?: any;
}

// API response types for authentication endpoints
export interface AuthApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RegisterResponse extends AuthApiResponse {
  data?: {
    user: User;
    profile?: UserProfile;
  };
}

export interface ProfileResponse extends AuthApiResponse {
  data?: {
    profile: UserProfile;
  };
}

// Form data types for authentication components
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  default_view_preference?: 'week' | 'today';
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface PasswordResetFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  household_size: number;
  menu_type: 'vegetarian' | 'omnivore';
  default_view_preference?: 'week' | 'today';
}

// Component prop types
export interface AuthComponentProps {
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface LoginFormProps extends AuthComponentProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export interface RegistrationFormProps extends AuthComponentProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  onBackToLogin: () => void;
}

export interface ForgotPasswordFormProps extends AuthComponentProps {
  onSubmit: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  success?: boolean;
}

export interface PasswordResetFormProps extends AuthComponentProps {
  onSubmit: (data: PasswordResetFormData) => Promise<void>;
  onBackToLogin: () => void;
  success?: boolean;
}

export interface UserProfileProps extends AuthComponentProps {
  profile: UserProfile;
  onUpdate: (data: UpdateProfileData) => Promise<void>;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
  updateLoading?: boolean;
  success?: string;
}

// Store types
export interface AuthStoreState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastError: AuthErrorInfo | null;
  sessionRefreshTimeout: NodeJS.Timeout | null;
  refreshAttempts: number;
  maxRefreshAttempts: number;
}

export interface AuthStoreActions {
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null, type?: AuthErrorInfo['type']) => void;
  clearError: () => void;
  scheduleSessionRefresh: (session: Session) => void;
  clearSessionRefresh: () => void;
  incrementRefreshAttempts: () => void;
  resetRefreshAttempts: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  signIn: (user: User, session: Session, profile?: UserProfile) => void;
  signOut: () => void;
  reset: () => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

// Hook return types
export interface UseAuthResult {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}
