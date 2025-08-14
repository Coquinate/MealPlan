/**
 * Improved authentication tests using Page Object Model
 * More reliable and maintainable than direct selectors
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { RegistrationPage } from '../../page-objects/RegistrationPage';
import { getTestUrls, isE2EConfigReady } from '../../helpers/test-env';

// Test configuration with fallbacks
const testUrls = getTestUrls();

// Test accounts (from migration supabase/migrations/00011_test_accounts.sql)
const TEST_ACCOUNTS = {
  trial: {
    email: 'trial@test.com',
    password: 'TestPass123!'
  },
  paid: {
    email: 'paid@test.com', 
    password: 'TestPass123!'
  },
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!'
  }
};

test.describe('Authentication Flow - Page Objects', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Check configuration before running tests
    isE2EConfigReady();
    
    loginPage = new LoginPage(page);
    await loginPage.goto(testUrls.app);
  });

  test('should display login form with all elements', async ({ page }) => {
    // Use Page Object to check form is ready
    await loginPage.isReady();
    
    // Check specific elements exist
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.createAccountLink).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Use Page Object methods instead of direct selectors
    await loginPage.login('invalid@test.com', 'wrongpassword');
    
    // Wait for and check error
    await loginPage.waitForError();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Use Page Object method
    await loginPage.clickCreateAccount();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*\/auth\/register/);
    
    // Initialize registration page and verify it's ready
    const registrationPage = new RegistrationPage(page);
    await registrationPage.isReady();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Use Page Object method
    await loginPage.clickForgotPassword();
    
    // Check navigation
    await expect(page).toHaveURL(/.*\/auth\/forgot-password/);
    await expect(page.locator('h1')).toContainText('Resetare parolă');
  });

  test('should handle successful login with test account', async ({ page }) => {
    // Use migration test account and Page Object
    await loginPage.login(TEST_ACCOUNTS.trial.email, TEST_ACCOUNTS.trial.password);
    
    // Wait for successful login
    await loginPage.waitForSuccessfulLogin();
    
    // Verify we're on dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

test.describe('Registration Flow - Page Objects', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    // Check configuration before running tests
    isE2EConfigReady();
    
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto(testUrls.app);
  });

  test('should display registration form with all elements', async ({ page }) => {
    // Use Page Object to check form is ready
    await registrationPage.isReady();
    
    // Check specific elements
    await expect(registrationPage.emailInput).toBeVisible();
    await expect(registrationPage.passwordInput).toBeVisible();
    await expect(registrationPage.confirmPasswordInput).toBeVisible();
    await expect(registrationPage.submitButton).toBeVisible();
  });

  test('should validate password mismatch', async ({ page }) => {
    // Use Page Object to fill form with mismatched passwords
    await registrationPage.fillForm({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPass123!'
    });
    
    await registrationPage.submit();
    
    // Check for password mismatch error using Page Object method
    expect(await registrationPage.hasPasswordMismatchError()).toBe(true);
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await registrationPage.submit();
    
    // Check for validation errors using Page Object
    expect(await registrationPage.hasValidationErrors()).toBe(true);
  });

  test('should navigate back to login', async ({ page }) => {
    // Use Page Object method
    await registrationPage.clickBackToLogin();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*\/auth\/login/);
    
    // Initialize login page and verify it's ready
    const loginPage = new LoginPage(page);
    await loginPage.isReady();
  });

  test('should create new account successfully', async ({ page }) => {
    // Generate unique test data
    const timestamp = Date.now();
    const testData = {
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      householdSize: '2',
      menuType: 'omnivore'
    };
    
    // Use Page Object to register
    await registrationPage.register(testData);
    
    // Wait for successful registration
    await registrationPage.waitForSuccessfulRegistration();
    
    // Verify we're on dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto(testUrls.dashboard);
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login/);
    
    // Should include redirect parameter
    const url = new URL(page.url());
    expect(url.searchParams.get('redirect')).toBe('/dashboard');
  });

  test('should redirect to login for admin routes', async ({ page }) => {
    // Try to access admin route without authentication
    await page.goto(`${testUrls.app}/admin`);
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});

test.describe('Session Management', () => {
  test('should maintain session after page refresh', async ({ page }) => {
    // Login using Page Object
    const loginPage = new LoginPage(page);
    await loginPage.goto(testUrls.app);
    await loginPage.login(TEST_ACCOUNTS.trial.email, TEST_ACCOUNTS.trial.password);
    
    // Wait for successful login
    await loginPage.waitForSuccessfulLogin();
    
    // Refresh page
    await page.reload();
    
    // Should still be authenticated (not redirected to login)
    await expect(page).not.toHaveURL(/.*\/auth\/login/);
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page, context }) => {
    // Initialize login page
    const loginPage = new LoginPage(page);
    await loginPage.goto(testUrls.app);
    
    // Simulate offline mode
    await context.setOffline(true);
    
    // Try to login
    await loginPage.login('test@example.com', 'Password123!');
    
    // Should show network error (text may vary based on implementation)
    await expect(page.locator('text=Eroare')).toBeVisible();
    
    // Restore online mode
    await context.setOffline(false);
  });
});