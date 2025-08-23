import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 375, height: 667 }
});

const page = await context.newPage();
await page.goto('http://localhost:3009');
await page.waitForTimeout(3000);

// Check for SVG elements in timeline cards
const svgCount = await page.locator('.lg\\:hidden.mt-6 svg').count();
console.log('SVG icons found in timeline:', svgCount);

// Get all icon containers
const iconContainers = await page.locator('.lg\\:hidden.mt-6 .rounded-lg.flex.items-center.justify-center').all();
console.log('Icon containers found:', iconContainers.length);

// Check each container
for (let i = 0; i < iconContainers.length; i++) {
  const svg = await iconContainers[i].locator('svg').count();
  const innerHTML = await iconContainers[i].innerHTML();
  console.log(`Container ${i + 1}: has SVG=${svg > 0}, HTML="${innerHTML.substring(0, 150)}"`);
}

// Take screenshot
await page.screenshot({ path: 'icons-debug.png', fullPage: false });

await browser.close();
