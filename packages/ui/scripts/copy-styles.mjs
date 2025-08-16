#!/usr/bin/env node

import { cp } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src', 'styles');
const destDir = join(__dirname, '..', 'dist', 'styles');

// Copy styles directory to dist
if (existsSync(srcDir)) {
  console.log(`Copying styles from ${srcDir} to ${destDir}...`);
  await cp(srcDir, destDir, { recursive: true });
  console.log('✅ Styles copied successfully.');
} else {
  console.log('⚠️ No styles directory found in src/');
}
