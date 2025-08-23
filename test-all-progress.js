import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('http://localhost:3009');
await page.waitForTimeout(2000);

// Get ALL progress bars
const progressBars = await page.locator('[role="progressbar"]').all();
console.log(`Found ${progressBars.length} progress bars`);

for (let i = 0; i < progressBars.length; i++) {
  const bar = progressBars[i];
  const ariaNow = await bar.getAttribute('aria-valuenow');
  const ariaMax = await bar.getAttribute('aria-valuemax');
  const ariaMin = await bar.getAttribute('aria-valuemin');
  
  // Get parent context
  const parentText = await bar.locator('..').textContent();
  
  // Check for progress fill
  const hasGradient = await bar.locator('.bg-gradient-to-r').count();
  let fillWidth = 'N/A';
  if (hasGradient > 0) {
    fillWidth = await bar.locator('.bg-gradient-to-r').first().evaluate(el => {
      return window.getComputedStyle(el).width;
    });
  }
  
  console.log(`\nProgress Bar ${i + 1}:`);
  console.log(`  aria-valuenow: ${ariaNow}`);
  console.log(`  aria-valuemax: ${ariaMax}`);
  console.log(`  aria-valuemin: ${ariaMin}`);
  console.log(`  Fill width: ${fillWidth}`);
  console.log(`  Parent text: ${parentText?.substring(0, 100)}...`);
}

await browser.close();
