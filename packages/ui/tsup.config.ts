import { defineConfig } from 'tsup';
import { resolve } from 'node:path';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
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
  // Copy CSS to dist (temporarily disabled for Vercel)
  // onSuccess: 'node scripts/copy-styles.mjs',
});
