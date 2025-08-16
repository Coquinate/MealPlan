import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture all logs
  const logs = [];
  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text() });
  });

  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(2000);

  // Check React rendering
  const reactContent = await page.evaluate(() => {
    const root = document.querySelector('#root');
    return {
      hasChildren: root?.children.length > 0,
      innerHTML: root?.innerHTML.substring(0, 500),
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
    };
  });

  console.log('React root content:', reactContent);
  console.log('\nAll console logs:');
  logs.forEach((log) => console.log(`[${log.type}] ${log.text}`));

  await browser.close();
})();
