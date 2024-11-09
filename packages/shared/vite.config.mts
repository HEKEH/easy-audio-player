import { readFileSync } from 'fs';
import { resolve } from 'path';
import { AliasOptions, defineConfig, UserConfig } from 'vite';
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
      dts({
        include: ['src/**/*.ts'],
        outDir: 'dist',
        tsconfigPath: './tsconfig.app.json',
        rollupTypes: true,
      }),
    ],
    build: {
      minify: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'EasyAudioPlayerShared',
        formats: ['es', 'cjs'],
        fileName: format => `index.${format}.js`,
      },
      rollupOptions: {
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ],
      },
      sourcemap: true,
    },
    resolve: {
      alias,
    },
  };
  return config;
});
