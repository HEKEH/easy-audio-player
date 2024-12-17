import type { AliasOptions } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const alias: AliasOptions = {
    '~': resolve(__dirname, './src/'),
    '@': resolve(__dirname, './'),
  };

  return {
    server: {
      port: 7080,
      hmr: {
        overlay: true,
      },
      watch: {
        ignored: [
          '!**/node_modules/easy-audio-player-vue/dist/**',
          '!**/node_modules/easy-audio-player-react/dist/**',
          '!**/node_modules/easy-audio-player-shared/dist/**',
        ],
      },
    },
    plugins: [
      vue(),
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: pkg.description,
          },
        },
      }),
    ],
    resolve: {
      alias,
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    build: {
      minify: mode === 'production',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'react', 'react-dom'],
          },
        },
      },
    },
  };
});
