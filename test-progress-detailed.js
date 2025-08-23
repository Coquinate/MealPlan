import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Inject console logs to see what's happening
await page.addInitScript(() => {
  // Override console.log to capture component logs
  const originalLog = console.log;
  window.capturedLogs = [];
  console.log = (...args) => {
    window.capturedLogs.push(args.join(' '));
    originalLog(...args);
  };
});

await page.goto('http://localhost:3009');
await page.waitForTimeout(2000);

// Get the actual props passed to ProgressIndicator
const progressProps = await page.evaluate(() => {
  const progressElement = document.querySelector('[role="progressbar"]');
  if (progressElement) {
    return {
      ariaNow: progressElement.getAttribute('aria-valuenow'),
      ariaMax: progressElement.getAttribute('aria-valuemax'),
      ariaMin: progressElement.getAttribute('aria-valuemin'),
    };
  }
  return null;
});
console.log('Progress element attributes:', progressProps);

// Check the actual displayed text
const spotsText = await page.locator('.font-semibold.text-sm').first().textContent();
console.log('Spots taken text:', spotsText);

const remainingText = await page.locator('.text-accent-coral.text-xs').first().textContent();
console.log('Remaining text:', remainingText);

// Check captured logs
const logs = await page.evaluate(() => window.capturedLogs);
console.log('Captured logs:', logs.filter(log => log.includes('subscriber') || log.includes('progress')));

await page.waitForTimeout(1000);
await browser.close();
