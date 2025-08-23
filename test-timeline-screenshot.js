import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 375, height: 812 } // iPhone X size for more height
});

const page = await context.newPage();
await page.goto('http://localhost:3009');
await page.waitForTimeout(3000);

// Scroll to timeline section
await page.evaluate(() => {
  const timeline = document.querySelector('.lg\\:hidden.mt-6');
  if (timeline) {
    timeline.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

await page.waitForTimeout(1000);

// Take screenshot of just the timeline
const timeline = await page.locator('.lg\\:hidden.mt-6').first();
if (timeline) {
  await timeline.screenshot({ path: 'timeline-only.png' });
  console.log('Timeline screenshot saved');
}

// Check icon visibility
const icons = await page.locator('.lg\\:hidden.mt-6 svg').all();
console.log(`Found ${icons.length} SVG icons`);

for (let i = 0; i < icons.length; i++) {
  const isVisible = await icons[i].isVisible();
  const box = await icons[i].boundingBox();
  const fill = await icons[i].evaluate(el => window.getComputedStyle(el).fill);
  const color = await icons[i].evaluate(el => window.getComputedStyle(el).color);
  const stroke = await icons[i].evaluate(el => window.getComputedStyle(el).stroke);
  console.log(`Icon ${i + 1}: visible=${isVisible}, color=${color}, stroke=${stroke}, fill=${fill}, box=${JSON.stringify(box)}`);
}

await browser.close();
