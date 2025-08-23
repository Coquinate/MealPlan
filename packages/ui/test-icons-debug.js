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

// Wait for animations
await page.waitForTimeout(2000);

// Check for SVG elements in timeline cards
const svgCount = await page.locator('.lg\\:hidden.mt-6 svg').count();
console.log('SVG icons found in timeline:', svgCount);

// Get all card HTML to see what's inside
const cards = await page.locator('.lg\\:hidden.mt-6 .rounded-xl').all();
console.log('Total cards found:', cards.length);

for (let i = 0; i < cards.length; i++) {
  const hasIcon = await cards[i].locator('svg').count();
  const iconContainer = await cards[i].locator('.rounded-lg.flex.items-center.justify-center').count();
  const text = await cards[i].textContent();
  console.log(`Card ${i + 1}: has SVG=${hasIcon > 0}, has icon container=${iconContainer > 0}, text="${text?.substring(0, 50)}..."`);
}

// Check specific icon container styles
const iconContainers = await page.locator('.lg\\:hidden.mt-6 .bg-gradient-to-br').all();
console.log('Icon containers with gradient:', iconContainers.length);

for (let i = 0; i < iconContainers.length; i++) {
  const innerHTML = await iconContainers[i].innerHTML();
  console.log(`Icon container ${i + 1} HTML:`, innerHTML.substring(0, 100));
}

await browser.close();
