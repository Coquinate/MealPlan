import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📸 Testing Admin Dashboard...');

  // Navigate to admin
  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'test-admin-load.png', fullPage: true });
  console.log('✅ Screenshot saved: test-admin-load.png');

  // Check if it redirects to login
  const url = page.url();
  console.log('Current URL:', url);

  if (url.includes('/login')) {
    console.log('⚠️  Redirected to login page - this is expected without authentication');
    await page.screenshot({ path: 'test-admin-login.png', fullPage: true });
  }

  // Try to check what's visible
  const title = await page.title();
  console.log('Page title:', title);

  // Check for any error messages
  const bodyText = await page.locator('body').innerText();
  if (bodyText.includes('error') || bodyText.includes('Error')) {
    console.log('❌ Error found on page:', bodyText.substring(0, 200));
  }

  await browser.close();
  console.log('✅ Test complete');
})();
