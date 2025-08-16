import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  external: ['react', 'react-dom'],
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production',
});
