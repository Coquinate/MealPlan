import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3004/admin');
  await page.waitForTimeout(2000);

  // Get actual page content
  const content = await page.evaluate(() => {
    return {
      title: document.title,
      h1Text: document.querySelector('h1')?.textContent,
      bodyText: document.body.textContent?.trim().substring(0, 500),
      rootHTML: document.querySelector('#root')?.innerHTML.substring(0, 1000),
      allH1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent),
      allH2: Array.from(document.querySelectorAll('h2')).map((h) => h.textContent),
      url: window.location.href,
    };
  });

  console.log('Page content:');
  console.log('- URL:', content.url);
  console.log('- Title:', content.title);
  console.log('- H1 tags:', content.allH1);
  console.log('- H2 tags:', content.allH2);
  console.log('\nBody text:', content.bodyText);
  console.log('\nRoot HTML (first 1000 chars):', content.rootHTML);

  await browser.close();
})();
