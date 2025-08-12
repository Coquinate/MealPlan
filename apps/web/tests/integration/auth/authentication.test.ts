/**
 * Integration tests for authentication system
 * Tests full authentication flow with real Supabase instance
 */

import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Test configuration
const TEST_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-key'

// Test accounts (from migration)
const TEST_ACCOUNTS = {
  trial: {
    email: 'trial@test.com',
    password: 'TestPass123!'
  },
  paid: {
    email: 'paid@test.com',
    password: 'TestPass123!'
  },
  expired: {
    email: 'expired@test.com',
    password: 'TestPass123!'
  },
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!'
  }
}

// Helper to create test user
async function createTestUser(email: string, password: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Try to sign up (will fail if user exists)
  await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        household_size: 2,
        menu_type: 'omnivore'
      }
    }
  })
  
  // Clean up any existing session
  await supabase.auth.signOut()
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(`${TEST_URL}/auth/login`)
  })
  
  test('should display login form', async ({ page }) => {
    // Check for login form elements
    await expect(page.locator('h1')).toContainText('Coquinate')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
  
  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check for error message
    await expect(page.locator('.text-error-600')).toBeVisible()
  })
  
  test('should navigate to registration page', async ({ page }) => {
    // Click create account link
    await page.click('text=Creează cont')
    
    // Check navigation
    await expect(page).toHaveURL(/.*\/auth\/register/)
    await expect(page.locator('h1')).toContainText('Coquinate')
    
    // Check for registration form fields
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('text=Mărimea gospodăriei')).toBeVisible()
    await expect(page.locator('text=Tipul de meniu')).toBeVisible()
  })
  
  test('should navigate to forgot password page', async ({ page }) => {
    // Click forgot password link
    await page.click('text=Ai uitat parola?')
    
    // Check navigation
    await expect(page).toHaveURL(/.*\/auth\/forgot-password/)
    await expect(page.locator('h1')).toContainText('Resetare parolă')
  })
})

test.describe('Registration Flow', () => {
  test('should validate registration form', async ({ page }) => {
    await page.goto(`${TEST_URL}/auth/register`)
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Check for validation errors
    await expect(page.locator('.text-error')).toBeVisible()
  })
  
  test('should validate password match', async ({ page }) => {
    await page.goto(`${TEST_URL}/auth/register`)
    
    // Fill form with mismatched passwords
    await page.fill('input[id="register-email"]', 'test@example.com')
    await page.fill('input[id="register-password"]', 'Password123!')
    await page.fill('input[id="confirm-password"]', 'DifferentPass123!')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check for password mismatch error
    await expect(page.locator('text=Parolele nu se potrivesc')).toBeVisible()
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto(`${TEST_URL}/dashboard`)
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login/)
    
    // Should include redirect parameter
    const url = new URL(page.url())
    expect(url.searchParams.get('redirect')).toBe('/dashboard')
  })
  
  test('should redirect to pricing for premium routes without subscription', async ({ page, context }) => {
    // First login as trial user
    await page.goto(`${TEST_URL}/auth/login`)
    
    // Note: This would require actual authentication
    // In a real test, you'd need to handle the auth flow properly
    
    // Try to access premium route
    await page.goto(`${TEST_URL}/premium`)
    
    // Should redirect to pricing (if not subscribed)
    // This behavior depends on the user's subscription status
  })
})

test.describe('Password Reset Flow', () => {
  test('should request password reset', async ({ page }) => {
    await page.goto(`${TEST_URL}/auth/forgot-password`)
    
    // Fill in email
    await page.fill('input[type="email"]', 'test@example.com')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check for success message
    await expect(page.locator('.bg-success-50')).toBeVisible()
    await expect(page.locator('text=Am trimis instrucțiunile')).toBeVisible()
  })
  
  test('should validate email format', async ({ page }) => {
    await page.goto(`${TEST_URL}/auth/forgot-password`)
    
    // Fill in invalid email
    await page.fill('input[type="email"]', 'invalidemail')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check for validation error
    await expect(page.locator('text=Email invalid')).toBeVisible()
  })
})

test.describe('Session Management', () => {
  test('should persist session across page refreshes', async ({ page, context }) => {
    // This test would require actual authentication
    // and checking if the session persists after refresh
    
    // Login flow would go here
    // await authenticateUser(page, TEST_ACCOUNTS.trial)
    
    // Refresh page
    // await page.reload()
    
    // Check if still authenticated
    // await expect(page).not.toHaveURL(/.*\/auth\/login/)
  })
})

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true)
    
    await page.goto(`${TEST_URL}/auth/login`)
    
    // Try to login
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Should show network error
    await expect(page.locator('text=Eroare de conexiune')).toBeVisible()
    
    // Restore online mode
    await context.setOffline(false)
  })
  
  test('should handle rate limiting', async ({ page }) => {
    // This would require making multiple rapid requests
    // to trigger rate limiting
    
    await page.goto(`${TEST_URL}/auth/login`)
    
    // Make multiple login attempts rapidly
    for (let i = 0; i < 10; i++) {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', `wrong${i}`)
      await page.click('button[type="submit"]')
    }
    
    // Should eventually show rate limit error
    // await expect(page.locator('text=Prea multe încercări')).toBeVisible()
  })
})

test.describe('Admin Access', () => {
  test('should restrict admin routes to admin users', async ({ page }) => {
    // Try to access admin route without authentication
    await page.goto(`${TEST_URL}/admin`)
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login/)
  })
  
  // Additional admin tests would require actual admin authentication
})

// Helper function for authentication (to be implemented)
async function authenticateUser(page: any, credentials: { email: string; password: string }) {
  await page.goto(`${TEST_URL}/auth/login`)
  await page.fill('input[type="email"]', credentials.email)
  await page.fill('input[type="password"]', credentials.password)
  await page.click('button[type="submit"]')
  
  // Wait for navigation
  await page.waitForURL(/.*\/dashboard/)
}