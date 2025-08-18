import { defineConfig } from 'tsup';
import { resolve } from 'node:path';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  external: [
    'react',
    'react-dom',
    'next/navigation',
    '@coquinate/i18n',
    '@coquinate/shared',
    '@coquinate/config',
  ],
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  // Post-build: copy CSS files
  onSuccess: async () => {
    const { existsSync, mkdirSync, cpSync } = await import('fs');
    const { join } = await import('path');

    const srcStyles = join(process.cwd(), 'src', 'styles');
    const distStyles = join(process.cwd(), 'dist', 'styles');

    if (existsSync(srcStyles)) {
      if (!existsSync(distStyles)) {
        mkdirSync(distStyles, { recursive: true });
      }
      cpSync(srcStyles, distStyles, { recursive: true });
      console.log('✅ Styles copied successfully.');
    }
  },
});
