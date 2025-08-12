import { supabase } from './client'
import type { Tables } from './client'

/**
 * Authentication utilities for Coquinate
 */

export interface SignUpData {
  email: string
  password: string
  householdSize: number
  menuType: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian'
  language?: 'ro' | 'en'
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Sign up a new user with profile creation
 */
export async function signUp(data: SignUpData) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        household_size: data.householdSize,
        menu_type: data.menuType,
        language: data.language || 'ro'
      }
    }
  })

  if (authError) {
    throw authError
  }

  if (!authData.user) {
    throw new Error('User creation failed')
  }

  // The user profile will be created automatically via database trigger
  // or can be created explicitly here if needed

  return authData
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })

  if (error) {
    throw error
  }

  return authData
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw error
  }
  
  return user
}

/**
 * Get the current user's profile from the database
 */
export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    throw error
  }
  
  return data as Tables<'users'>
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: Partial<Tables<'users'>>) {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Request a password reset for an email
 */
export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  
  if (error) {
    throw error
  }
}

/**
 * Update password with a reset token
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) {
    throw error
  }
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, has_active_trial, trial_ends_at')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    return false
  }
  
  // Check if user has active subscription
  if (profile.subscription_status === 'active') {
    return true
  }
  
  // Check if user has active trial
  if (profile.has_active_trial && profile.trial_ends_at) {
    const trialEndDate = new Date(profile.trial_ends_at)
    return trialEndDate > new Date()
  }
  
  return false
}

/**
 * Admin authentication check
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  const { data } = await supabase
    .from('admin_users')
    .select('id, is_active')
    .eq('email', user.email!)
    .eq('is_active', true)
    .single()
  
  return !!data
}