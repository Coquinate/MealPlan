import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('🔍 Debugging Admin Dashboard...\n');

  // Navigate to admin
  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(1000);

  // Get page content
  const title = await page.title();
  const url = page.url();
  const bodyText = await page.locator('body').innerText();
  const htmlContent = await page.content();

  console.log('URL:', url);
  console.log('Title:', title);
  console.log('\nBody text (first 500 chars):');
  console.log(bodyText.substring(0, 500));

  // Check if there's a root div
  const hasRoot = (await page.locator('#root').count()) > 0;
  console.log('\nHas #root element:', hasRoot);

  // Check for any React error
  const reactError = (await page.locator('.error-boundary').count()) > 0;
  console.log('Has error boundary triggered:', reactError);

  // Check console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Reload to catch console errors
  await page.reload();
  await page.waitForTimeout(1000);

  if (errors.length > 0) {
    console.log('\n❌ Console errors found:');
    errors.forEach((err) => console.log('  -', err));
  }

  // Check if it's a blank page
  const isBlank = bodyText.trim().length === 0;
  console.log('\nIs blank page:', isBlank);

  // Save screenshot for debugging
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('\n📸 Debug screenshot saved as debug-screenshot.png');

  // Check network for failed resources
  const failedRequests = [];
  page.on('requestfailed', (request) => {
    failedRequests.push(request.url());
  });

  await browser.close();
})();
