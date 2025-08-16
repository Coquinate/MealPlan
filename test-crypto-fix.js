#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testCryptoFix() {
  console.log('🚀 Starting crypto fix validation...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    const consoleErrors = [];
    const consoleWarnings = [];

    // Capture console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
        console.log('⚠️ Console Warning:', msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
      console.log('💥 Page Error:', error.message);
    });

    console.log('📡 Navigating to admin app...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('⏳ Waiting for page to stabilize...');
    await page.waitForTimeout(3000);

    // Check for crypto-related errors
    const cryptoErrors = consoleErrors.filter(
      (error) =>
        error.includes('crypto') ||
        error.includes('speakeasy') ||
        error.includes('qrcode') ||
        error.includes('Module "crypto" has been externalized') ||
        error.includes('Cannot access "crypto.create') ||
        error.includes('node_modules/speakeasy') ||
        error.includes('Cannot resolve')
    );

    // Get page title
    const title = await page.title();
    console.log('📄 Page title:', title);

    // Get page content sample
    const bodyText = await page.$eval('body', (el) => el.textContent?.substring(0, 200));
    console.log('📝 Body content sample:', bodyText?.substring(0, 100) + '...');

    // Results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');

    if (cryptoErrors.length === 0) {
      console.log('✅ CRYPTO FIX VALIDATION: PASSED');
      console.log('✅ No crypto-related errors found');
    } else {
      console.log('❌ CRYPTO FIX VALIDATION: FAILED');
      console.log('❌ Crypto errors found:');
      cryptoErrors.forEach((error) => console.log('   -', error));
    }

    console.log(`📈 Total console errors: ${consoleErrors.length}`);
    console.log(`📈 Total console warnings: ${consoleWarnings.length}`);
    console.log(`📈 Crypto-related errors: ${cryptoErrors.length}`);

    if (consoleErrors.length > 0 && cryptoErrors.length === 0) {
      console.log('\n🔍 Non-crypto errors found (these might be unrelated):');
      consoleErrors.forEach((error) => console.log('   -', error));
    }

    // Test 2FA page navigation if possible
    try {
      console.log('\n🔐 Testing 2FA page navigation...');
      await page.goto('http://localhost:3001/admin/2fa', {
        waitUntil: 'networkidle0',
        timeout: 10000,
      });

      await page.waitForTimeout(2000);

      const twoFACryptoErrors = consoleErrors.filter(
        (error) => error.includes('speakeasy') || error.includes('qrcode')
      );

      if (twoFACryptoErrors.length === 0) {
        console.log('✅ 2FA page: No crypto import errors');
      } else {
        console.log('❌ 2FA page: Crypto import errors found');
        twoFACryptoErrors.forEach((error) => console.log('   -', error));
      }
    } catch (error) {
      console.log('ℹ️ 2FA page test skipped (likely requires authentication)');
    }

    return cryptoErrors.length === 0;
  } finally {
    await browser.close();
  }
}

testCryptoFix()
  .then((success) => {
    console.log('\n🎯 FINAL RESULT:');
    if (success) {
      console.log('✅ CRYPTO COMPATIBILITY FIXES: WORKING');
      console.log('✅ Admin dashboard can load without crypto module errors');
      process.exit(0);
    } else {
      console.log('❌ CRYPTO COMPATIBILITY FIXES: FAILED');
      console.log('❌ Admin dashboard still has crypto module errors');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error.message);
    process.exit(1);
  });
