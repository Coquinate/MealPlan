#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');

const srcStyles = join(packageRoot, 'src', 'styles');
const distStyles = join(packageRoot, 'dist', 'styles');

if (existsSync(srcStyles)) {
  // Create dist/styles directory if it doesn't exist
  if (!existsSync(distStyles)) {
    mkdirSync(distStyles, { recursive: true });
  }

  // Copy all files from src/styles to dist/styles
  cpSync(srcStyles, distStyles, { recursive: true });
  console.log('✅ Styles copied successfully.');
} else {
  console.log('⚠️ No styles directory found at src/styles');
}