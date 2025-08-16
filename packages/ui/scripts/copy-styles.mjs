import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const source = path.resolve(__dirname, '../src/styles');
const destination = path.resolve(__dirname, '../dist/styles');

console.log(`Copying styles from ${source} to ${destination}...`);

try {
  await fs.cp(source, destination, { recursive: true });
  console.log('✅ Styles copied successfully.');
} catch (error) {
  console.error('❌ Error copying styles:', error);
  process.exit(1);
}