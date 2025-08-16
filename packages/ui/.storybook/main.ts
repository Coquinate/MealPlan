import type { StorybookConfig } from '@storybook/react-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    'msw-storybook-addon',
  ],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript', // Fix pentru React 19/TS
  },
  staticDirs: ['../public'], // Assets pentru stories
  viteFinal: async (config) => {
    // Auto-aliases din tsconfig (zero drift)
    config.plugins = [
      ...(config.plugins ?? []),
      tsconfigPaths({
        projects: [path.resolve(__dirname, '../tsconfig.json')],
      }),
      svgr(),
    ];

    // Prevent duplicate React instances
    config.resolve = {
      ...config.resolve,
      dedupe: ['react', 'react-dom'],
      preserveSymlinks: true,
    };

    // Ensure CSS processing works correctly with Tailwind content detection
    config.css = {
      ...(config.css ?? {}),
      postcss: {
        postcssOptions: {
          config: path.resolve(__dirname, '../postcss.config.js'),
        },
      },
    };

    // Help Vite watch for changes in component files for Tailwind
    config.server = {
      ...(config.server ?? {}),
      watch: {
        ...config.server?.watch,
        ignored: ['!**/src/**', '!**/.storybook/**'],
      },
    };

    // Define global variables for Next.js compatibility
    config.define = {
      ...config.define,
      global: 'globalThis',
      'process.env': {},
    };

    return config;
  },
};

export default config;
