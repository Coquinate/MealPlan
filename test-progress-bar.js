import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Listen for console messages
page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    console.log(`${msg.type().toUpperCase()}: ${msg.text()}`);
  }
});

await page.goto('http://localhost:3009');
await page.waitForTimeout(3000);

// Check if ProgressIndicator is rendered
const progressBar = await page.locator('[role="progressbar"]').count();
console.log('Progress bar elements found:', progressBar);

if (progressBar > 0) {
  const ariaValueNow = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow');
  const ariaValueMax = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuemax');
  console.log(`Progress: ${ariaValueNow}/${ariaValueMax}`);
  
  // Check the width of the progress fill
  const fillWidth = await page.locator('[role="progressbar"] .bg-gradient-to-r').first().evaluate(el => {
    return window.getComputedStyle(el).width;
  });
  console.log('Progress fill width:', fillWidth);
}

// Check for the percentage text
const percentageText = await page.locator('#progress-description').textContent();
console.log('Percentage text:', percentageText);

// Check if API call fails
const apiResponse = await page.evaluate(async () => {
  try {
    const response = await fetch('/api/subscribers/count');
    return {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    };
  } catch (error) {
    return { error: error.message };
  }
});
console.log('API Response:', apiResponse);

await browser.close();
