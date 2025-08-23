import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 375, height: 667 }, // iPhone SE size
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
});

const page = await context.newPage();

// Navigate to the page
await page.goto('http://localhost:3009');
await page.waitForLoadState('networkidle');

// Wait a bit for animations
await page.waitForTimeout(2000);

// Check if WorkflowTimeline is visible - more specific selector
const timelineVisible = await page.locator('.lg\\:hidden.mt-6').first().isVisible();
console.log('WorkflowTimeline container visible:', timelineVisible);

// Check for timeline elements
const timelineElements = await page.locator('.lg\\:hidden.mt-6').first().locator('.rounded-xl').count();
console.log('Timeline elements found:', timelineElements);

// Get computed styles of the container
const containerBox = await page.locator('.lg\\:hidden.mt-6').first().boundingBox();
console.log('Container bounding box:', containerBox);

// Check for any timeline steps with Romanian text
const steps = await page.locator('.lg\\:hidden.mt-6').first().locator('text=/Gătești|Refolosești|Reinventezi/').count();
console.log('Timeline steps with text found:', steps);

// Take screenshot
await page.screenshot({ path: 'workflow-mobile-test.png', fullPage: true });
console.log('Screenshot saved as workflow-mobile-test.png');

await browser.close();