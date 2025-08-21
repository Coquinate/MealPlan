import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // Navigate to the homepage
  await page.goto('http://localhost:3000');
  
  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit more for animations to complete
  await page.waitForTimeout(2000);
  
  // Take screenshot focused on the workflow nodes area
  await page.screenshot({ 
    path: '/home/alexandru/Projects/MealPlan/apps/web/workflow-nodes-screenshot.png',
    fullPage: false
  });
  
  console.log('Screenshot saved as workflow-nodes-screenshot.png');
  
  await browser.close();
})();