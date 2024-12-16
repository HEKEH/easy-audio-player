import vuePlugin from 'eslint-plugin-vue';
import vueParser from '@vue/eslint-parser';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: vueParser,
    },
    rules: {
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-components': 'error',
    },
  },
];
