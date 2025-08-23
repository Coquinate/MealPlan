#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../apps/web/public/favicon-qdots.svg');
  const outputDir = path.join(__dirname, '../apps/web/public');
  
  try {
    const svgBuffer = await fs.readFile(svgPath);
    
    // Generate PNG versions
    for (const { size, name } of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`✓ Generated ${name}`);
    }
    
    // Generate ICO file (multi-resolution)
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));
    
    console.log('✓ Generated favicon.ico');
    console.log('\n✨ All favicons generated successfully!');
    
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();