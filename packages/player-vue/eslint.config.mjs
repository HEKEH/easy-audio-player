import baseConfig from '../../eslint.config.mjs';
import vuePlugin from 'eslint-plugin-vue';

export default [
  ...baseConfig,
  {
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-components': 'error',
    },
  },
];
