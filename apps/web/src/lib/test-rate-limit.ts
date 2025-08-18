/**
 * Test script for rate limiter after security fix
 */

// Import the rate limiter
import { emailSignupLimiter } from './rate-limit.ts';

console.log('Testing Rate Limiter after security fix...\n');

// Test 1: Normal behavior - 5 requests per hour
console.log('TEST 1: Normal rate limiting (5 requests/hour)');
const testIp1 = '192.168.1.1';
for (let i = 1; i <= 7; i++) {
  const limited = emailSignupLimiter.isRateLimited(testIp1);
  console.log(`Request ${i} from ${testIp1}: ${limited ? 'BLOCKED' : 'ALLOWED'}`);
}

console.log('\n---\n');

// Test 2: Multiple IPs don't interfere
console.log('TEST 2: Multiple IPs work independently');
const testIp2 = '192.168.1.2';
const testIp3 = '192.168.1.3';

for (let i = 1; i <= 3; i++) {
  console.log(
    `Request ${i} from ${testIp2}: ${emailSignupLimiter.isRateLimited(testIp2) ? 'BLOCKED' : 'ALLOWED'}`
  );
  console.log(
    `Request ${i} from ${testIp3}: ${emailSignupLimiter.isRateLimited(testIp3) ? 'BLOCKED' : 'ALLOWED'}`
  );
}

console.log('\n---\n');

// Test 3: Simulate attack - try to fill the store
console.log('TEST 3: Simulating attack with many IPs (testing capacity limit)');
console.log('Creating 1000+ different IPs to test capacity handling...');

for (let i = 0; i < 1005; i++) {
  const ip = `10.0.${Math.floor(i / 256)}.${i % 256}`;
  emailSignupLimiter.isRateLimited(ip);

  if (i === 999) {
    console.log('At 1000 entries - next entries should not be added...');
  }
}

// Now test that original IPs still work
console.log('\nTesting if original IPs still have their rate limits:');
const stillLimited = emailSignupLimiter.isRateLimited(testIp1);
console.log(
  `${testIp1} is ${stillLimited ? 'still BLOCKED (GOOD!)' : 'NOT blocked (would be BAD in old code)'}`
);

// Test a new IP when at capacity
const newIp = '192.168.99.99';
console.log(
  `\nNew IP ${newIp} when at capacity: ${emailSignupLimiter.isRateLimited(newIp) ? 'BLOCKED' : 'ALLOWED (fail open)'}`
);

console.log('\n✅ Test complete! Check console warnings above for capacity messages.');
