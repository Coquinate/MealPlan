import { chromium } from 'playwright';

async function takeWorkflowScreenshot() {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('Waiting for page to load...');
    await page.waitForTimeout(3000);
    
    // Try to wait for the hero section or workflow elements
    try {
      await page.waitForSelector('[data-testid="hero-section"], .hero, h1', { timeout: 10000 });
    } catch (e) {
      console.log('Could not find hero section selector, continuing anyway...');
    }
    
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: 'workflow-nodes-current.png',
      fullPage: false,
      type: 'png'
    });
    
    console.log('Screenshot saved as workflow-nodes-current.png');
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
    
    // Try to get page title and URL for debugging
    try {
      const title = await page.title();
      const url = page.url();
      console.log('Page title:', title);
      console.log('Page URL:', url);
    } catch (e) {
      console.log('Could not get page info');
    }
  } finally {
    await browser.close();
  }
}

takeWorkflowScreenshot().catch(console.error);