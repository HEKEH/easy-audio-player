import { resolve } from 'path';
import { readFileSync } from 'fs';
import { AliasOptions, defineConfig, PluginOption, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
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
