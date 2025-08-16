import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('📸 Taking screenshots of Admin Dashboard...\n');

  // Login page
  await page.goto('http://localhost:3004/admin/login');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'admin-login-light.png', fullPage: true });
  console.log('✅ Login page (light mode) screenshot saved');

  // Check if theme toggle exists on login page
  const themeToggle = await page.locator('[data-testid="theme-toggle"]').count();
  if (themeToggle > 0) {
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'admin-login-dark.png', fullPage: true });
    console.log('✅ Login page (dark mode) screenshot saved');
  }

  // Try to navigate directly to admin dashboard (should redirect to login)
  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  console.log('\n📍 Direct navigation to /admin redirects to:', currentUrl);

  // Check Romanian text on login page
  const bodyText = await page.locator('body').innerText();
  const romanianTexts = [
    'Autentificare Administrator',
    'Email',
    'Parolă',
    'Autentificare',
    'Ați uitat parola?',
  ];

  console.log('\n🇷🇴 Romanian translations on login page:');
  for (const text of romanianTexts) {
    const found = bodyText.includes(text);
    console.log(`  ${found ? '✅' : '❌'} "${text}"`);
  }

  // Check form elements
  const emailInput = (await page.locator('[data-testid="admin-email-input"]').count()) > 0;
  const passwordInput = (await page.locator('[data-testid="admin-password-input"]').count()) > 0;
  const loginButton = (await page.locator('[data-testid="admin-login-button"]').count()) > 0;

  console.log('\n📝 Form elements:');
  console.log(`  ${emailInput ? '✅' : '❌'} Email input field`);
  console.log(`  ${passwordInput ? '✅' : '❌'} Password input field`);
  console.log(`  ${loginButton ? '✅' : '❌'} Login button`);

  // Check styling
  const styles = await page.evaluate(() => {
    const body = document.body;
    const root = document.querySelector('#root > div');
    return {
      bodyBg: window.getComputedStyle(body).backgroundColor,
      rootMinHeight: root ? window.getComputedStyle(root).minHeight : 'none',
      hasTailwindClasses: root?.className.includes('min-h-screen'),
    };
  });

  console.log('\n🎨 Styling check:');
  console.log(`  Background color: ${styles.bodyBg}`);
  console.log(`  Min height: ${styles.rootMinHeight}`);
  console.log(`  Tailwind classes applied: ${styles.hasTailwindClasses ? '✅' : '❌'}`);

  await browser.close();
  console.log('\n✅ Visual testing complete!');
})();
