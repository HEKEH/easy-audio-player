import eslint from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import vuePlugin from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
  // Base configurations
  eslint.configs.recommended,
  prettier,
  {
    ignores: ['node_modules/*', 'log/*', 'static/*', '**/dist/*'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
  },

  // Plugin configurations
  {
    plugins: {
      '@typescript-eslint': tsEslint,
      prettier: prettierPlugin,
      import: importPlugin,
      vue: vuePlugin,
    },
    rules: {
      // Vue related rules
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-components': 'error',

      // TypeScript related rules
      'prettier/prettier': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      // Import related rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
            },
            {
              pattern: '@/**',
              group: 'external',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      curly: ['error', 'all'],
    },
  },
];
