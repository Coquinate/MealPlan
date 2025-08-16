import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@coquinate/shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@coquinate/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@coquinate/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
        '@coquinate/database': path.resolve(__dirname, '../../packages/database/src'),
      },
    },
    define: {
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      ),
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['@coquinate/ui'],
          },
        },
      },
    },
    server: {
      port: 3001,
      host: true,
    },
  };
});
