import antfu from '@antfu/eslint-config';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default antfu(
  {
    rules: {
      'style/semi': 'off',
      'style/operator-linebreak': 'off',
      'style/arrow-parens': 'off',
      'style/brace-style': 'off',
      'style/member-delimiter-style': 'off',
      'style/multiline-ternary': 'off',
      'style/quote-props': 'off',
    },
  },
  {
    files: ['packages/player-react/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
