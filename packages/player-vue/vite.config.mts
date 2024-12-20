import type { AliasOptions, PluginOption, UserConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
  );

  const alias: AliasOptions = {
    '~': resolve(__dirname, './src/'),
    '@': resolve(__dirname, './'),
  };

  const config: UserConfig = {
    plugins: [
      cssInjectedByJsPlugin({
        styleId: 'easy-audio-player-vue-style',
        relativeCSSInjection: true, // for multiple format
      }),
      vue() as PluginOption,
      vueJsx() as PluginOption,
      dts({
        outDir: 'dist',
        tsconfigPath: './tsconfig.build.json',
        rollupTypes: true,
        copyDtsFiles: true,
      }),
    ],
    build: {
      minify: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'EasyAudioPlayerVue',
        formats: ['es', 'cjs'],
        fileName: format => `index.${format}.js`,
      },
      watch: {
        include: ['node_modules/easy-audio-player-shared/dist/**'],
      },
      rollupOptions: {
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
      sourcemap: false,
    },
    resolve: {
      alias,
    },
  };
  return config;
});
