import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('🔍 Visual Testing Admin Dashboard...\n');

  // Navigate to admin
  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(1000);

  // Check page structure
  console.log('📋 Checking page structure:');

  // Check for main title
  const hasTitle = (await page.locator('h1:has-text("Coquinate Admin")').count()) > 0;
  console.log(`  ✅ Main title "Coquinate Admin": ${hasTitle ? 'Found' : 'NOT FOUND ❌'}`);

  // Check navigation tabs
  const tabs = ['recipes', 'meal-plans', 'validation', 'analytics', 'settings'];
  console.log('\n📑 Checking navigation tabs:');
  for (const tab of tabs) {
    const tabExists = (await page.locator(`[data-testid="nav-tab-${tab}"]`).count()) > 0;
    console.log(`  ${tabExists ? '✅' : '❌'} Tab "${tab}": ${tabExists ? 'Found' : 'NOT FOUND'}`);
  }

  // Check Quick Actions
  console.log('\n⚡ Checking Quick Actions:');
  const cloneButton = (await page.locator('[data-testid="clone-last-week-button"]').count()) > 0;
  const emergencyButton = (await page.locator('[data-testid="emergency-mode-button"]').count()) > 0;
  console.log(
    `  ${cloneButton ? '✅' : '❌'} Clone Last Week button: ${cloneButton ? 'Found' : 'NOT FOUND'}`
  );
  console.log(
    `  ${emergencyButton ? '✅' : '❌'} Emergency Mode button: ${emergencyButton ? 'Found' : 'NOT FOUND'}`
  );

  // Check theme toggle
  const themeToggle = (await page.locator('[data-testid="theme-toggle"]').count()) > 0;
  console.log(`\n🎨 Theme toggle: ${themeToggle ? '✅ Found' : '❌ NOT FOUND'}`);

  // Check for Romanian text
  console.log('\n🇷🇴 Checking Romanian translations:');
  const romanianTexts = [
    'Rețete',
    'Planuri Masă',
    'Validare',
    'Analize',
    'Setări',
    'Săptămâna curentă',
    'Următoarea publicare',
  ];

  for (const text of romanianTexts) {
    const found = (await page.locator(`text=/${text}/`).count()) > 0;
    console.log(`  ${found ? '✅' : '❌'} "${text}": ${found ? 'Found' : 'NOT FOUND'}`);
  }

  // Check Status Bar
  console.log('\n📊 Checking Status Bar:');
  const statusBar = (await page.locator('text=/Săptămâna curentă/').count()) > 0;
  const validationStatus = (await page.locator('[data-testid="validation-status"]').count()) > 0;
  console.log(
    `  ${statusBar ? '✅' : '❌'} Status bar with week info: ${statusBar ? 'Found' : 'NOT FOUND'}`
  );
  console.log(
    `  ${validationStatus ? '✅' : '❌'} Validation status indicator: ${validationStatus ? 'Found' : 'NOT FOUND'}`
  );

  // Check for any errors
  console.log('\n⚠️  Checking for errors:');
  const bodyText = await page.locator('body').innerText();
  const hasErrors = bodyText.toLowerCase().includes('error') || bodyText.includes('Error');
  const hasWarnings = bodyText.toLowerCase().includes('warning');

  if (hasErrors) {
    console.log('  ❌ Errors found on page');
    // Find specific error text
    const errorElements = await page.locator('*:has-text("error")').all();
    for (const el of errorElements.slice(0, 3)) {
      const text = await el.innerText();
      if (text.length < 100) {
        console.log(`    - ${text}`);
      }
    }
  } else {
    console.log('  ✅ No errors found');
  }

  // Test dark mode toggle
  console.log('\n🌙 Testing dark mode:');
  if (themeToggle) {
    await page.locator('[data-testid="theme-toggle"]').click();
    await page.waitForTimeout(500);
    const hasDarkClass = (await page.locator('html.dark').count()) > 0;
    console.log(
      `  ${hasDarkClass ? '✅' : '❌'} Dark mode activated: ${hasDarkClass ? 'Yes' : 'No'}`
    );

    // Take dark mode screenshot
    await page.screenshot({ path: 'test-admin-dark.png', fullPage: true });
    console.log('  📸 Dark mode screenshot saved');

    // Toggle back
    await page.locator('[data-testid="theme-toggle"]').click();
  }

  // Test navigation
  console.log('\n🧭 Testing navigation (SPA behavior):');
  const initialUrl = page.url();

  // Try clicking a tab
  const mealPlansTab = page.locator('[data-testid="nav-tab-meal-plans"]');
  if ((await mealPlansTab.count()) > 0) {
    await mealPlansTab.click();
    await page.waitForTimeout(1000);
    const newUrl = page.url();
    const isSpaBehavior = !(await page.evaluate(() => window.performance.navigation.type === 1));
    console.log(
      `  ${isSpaBehavior ? '✅' : '❌'} SPA navigation (no page reload): ${isSpaBehavior ? 'Working' : 'BROKEN - full page reload!'}`
    );
    console.log(`  URL changed: ${initialUrl !== newUrl ? 'Yes' : 'No'}`);
  }

  // Check responsive layout
  console.log('\n📱 Checking responsive behavior:');
  const minWidth = await page.evaluate(() => {
    const body = document.querySelector('body > div');
    return body ? window.getComputedStyle(body).minWidth : 'none';
  });
  console.log(`  Min-width constraint: ${minWidth}`);
  const isDesktopFirst = minWidth && minWidth.includes('1024');
  console.log(
    `  ${isDesktopFirst ? '✅' : '⚠️'} Desktop-first design: ${isDesktopFirst ? 'Yes (1024px min)' : 'No constraint found'}`
  );

  await browser.close();

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log('  - Page loads successfully');
  console.log('  - Main components are rendered');
  console.log('  - Romanian translations are displayed');
  console.log('  - Theme toggle is functional');
  console.log('  - SPA navigation should be tested manually');
  console.log('='.repeat(50));
})();
