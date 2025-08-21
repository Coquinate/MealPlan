import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  const colors = await page.evaluate(() => {
    const body = document.body;
    const root = document.documentElement;
    return {
      bodyBackground: getComputedStyle(body).backgroundColor,
      surfaceVar: getComputedStyle(root).getPropertyValue('--color-surface'),
      eggshellVar: getComputedStyle(root).getPropertyValue('--color-surface-eggshell'),
      gray50Var: getComputedStyle(root).getPropertyValue('--color-gray-50'),
      dataMode: body.getAttribute('data-mode') || 'none'
    };
  });
  
  console.log('🎨 Color Analysis:');
  console.log('==================');
  console.log('Body Background:', colors.bodyBackground);
  console.log('--color-surface:', colors.surfaceVar);
  console.log('--color-surface-eggshell:', colors.eggshellVar);
  console.log('--color-gray-50:', colors.gray50Var);
  console.log('data-mode:', colors.dataMode);
  console.log('==================');
  
  // Check if it's eggshell
  if (colors.bodyBackground.includes('255') && colors.bodyBackground.includes('248') && colors.bodyBackground.includes('243')) {
    console.log('✅ Background is EGGSHELL color #FFF8F3 (warm cream from v0)!');
  } else if (colors.bodyBackground === '#FFF8F3' || colors.bodyBackground.toLowerCase() === '#fff8f3') {
    console.log('✅ Background is EGGSHELL color #FFF8F3 (warm cream from v0)!');
  } else {
    console.log('❌ Background is NOT the expected eggshell color');
    console.log('   Expected: #FFF8F3 or rgb(255, 248, 243)');
    console.log('   Got:', colors.bodyBackground);
  }
  
  await browser.close();
})();