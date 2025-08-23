import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE viewport
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  console.log('Navigând la pagina coming soon...');
  await page.goto('http://localhost:3009/');
  
  // Așteaptă să se încarce complet pagina
  await page.waitForLoadState('networkidle');
  
  console.log('Realizând screenshot-ul...');
  await page.screenshot({ 
    path: '/home/alexandru/Projects/MealPlan/coming-soon-mobile-final.png',
    fullPage: true 
  });
  
  // Verifică dacă WorkflowTimeline este vizibil
  const workflowVisible = await page.isVisible('text=Planifică');
  console.log('WorkflowTimeline vizibil pe mobil:', workflowVisible);
  
  // Verifică textul "Toți înscrișii primesc un trial extins la 7 zile!"
  const trialText = await page.isVisible('text=Toți înscrișii primesc un trial extins la 7 zile!');
  console.log('Text trial vizibil:', trialText);
  
  // Verifică dacă "CQ" nu apare în header
  const cqText = await page.isVisible('text=CQ');
  console.log('Text "CQ" găsit (nu ar trebui):', cqText);
  
  // Verifică dacă "Coquinate" este vizibil
  const logoText = await page.isVisible('text=Coquinate');
  console.log('Text "Coquinate" vizibil:', logoText);
  
  // Verifică pozițiile relative ale elementelor
  const inCurandBadge = await page.locator('text=În curând').boundingBox();
  const darkModeToggle = await page.locator('[data-testid="dark-mode-toggle"]').boundingBox();
  
  console.log('Poziția badge-ului "În curând":', inCurandBadge);
  console.log('Poziția dark mode toggle:', darkModeToggle);
  
  if (inCurandBadge && darkModeToggle) {
    const noOverlap = darkModeToggle.y > inCurandBadge.y + inCurandBadge.height;
    console.log('Dark mode toggle NU se suprapune cu badge-ul:', noOverlap);
  }
  
  console.log('Screenshot salvat ca: coming-soon-mobile-final.png');
  
  await browser.close();
})();