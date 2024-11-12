import { resolve } from 'path';
import { AliasOptions, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const alias: AliasOptions = {
    '~': resolve(__dirname, './src/'),
    '@': resolve(__dirname, './'),
  };

  return {
    server: {
      watch: {
        ignored: [
          // '**/node_modules/**', // need to watch node_modules for hot reload
          '**/dist/**',
          resolve(__dirname, '../!(demo)/**'), // ignore all apps except demo
        ],
      },
    },
    plugins: [vue(), vueJsx()],
    resolve: {
      alias,
    },
  };
});
