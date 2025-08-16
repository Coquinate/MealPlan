import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture console messages and errors
  const logs = [];
  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', (error) => {
    logs.push({ type: 'pageerror', text: error.message });
  });

  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(2000);

  console.log('Console output:');
  logs.forEach((log) => {
    console.log(`[${log.type}] ${log.text}`);
  });

  // Check if React app mounted
  const reactMounted = await page.evaluate(() => {
    return document.querySelector('#root')?.children.length > 0;
  });

  console.log('\nReact app mounted:', reactMounted);

  await browser.close();
})();
