/// <reference types="vitest/config" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/pokemon-netflix/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
    svgr(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup.jsdom.ts',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
