import { defineConfig } from 'tsup';
import { resolve } from 'node:path';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: false, // Temporar dezactivat pentru a permite build-ul
  format: ['esm'],
  external: ['react', 'react-dom', '@coquinate/i18n', '@coquinate/shared', '@coquinate/config'],
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  // Copy CSS to dist (cross-platform)
  // onSuccess: 'node scripts/copy-styles.mjs', // Temporar dezactivat pentru Vercel
});
